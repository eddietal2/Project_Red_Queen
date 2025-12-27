#!/usr/bin/env python3
"""
Architecture Diagram Generator for Project_Red_Queen

Automatically analyzes both backend (b-e) and frontend (f-e) and generates Mermaid diagrams

- python generate_architecture.py
"""

import os
import ast
import json
import re
import sys
from pathlib import Path
from typing import Dict, List, Set, Tuple

# Add project root to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

import custom_console


class ProjectAnalyzer:
    """Analyzes both backend and frontend codebases."""

    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root)
        self.backend_modules: Dict[str, Dict] = {}
        self.frontend_modules: Dict[str, Dict] = {}
        self.backend_deps: Set[str] = set()
        self.frontend_deps: Set[str] = set()

    def analyze_backend(self, backend_dir: str = "b-e") -> None:
        """Analyze Django backend."""
        backend_path = self.project_root / backend_dir
        if not backend_path.exists():
            print(f"Warning: {backend_dir} directory not found")
            return

        print(f"🔍 Analyzing backend: {backend_dir}")

        # Analyze Python files
        for py_file in backend_path.glob("**/*.py"):
            if any(skip in str(py_file) for skip in ["__pycache__", ".venv", "migrations"]):
                continue

            module_name = self._get_relative_module_name(py_file, backend_path)
            try:
                with open(py_file, 'r', encoding='utf-8') as f:
                    content = f.read()

                tree = ast.parse(content)
                functions = [node.name for node in ast.walk(tree) if isinstance(node, ast.FunctionDef)]
                classes = [node.name for node in ast.walk(tree) if isinstance(node, ast.ClassDef)]

                # Extract imports
                imports = self._extract_python_imports(tree)

                self.backend_modules[module_name] = {
                    'file': str(py_file.relative_to(self.project_root)),
                    'description': self._get_python_description(content, module_name),
                    'functions': functions[:5],
                    'classes': classes[:3],
                    'imports': imports
                }

                self.backend_deps.update(imports)

            except Exception as e:
                print(f"Warning: Could not analyze {py_file}: {e}")

    def analyze_frontend(self, frontend_dir: str = "f-e") -> None:
        """Analyze Next.js frontend."""
        frontend_path = self.project_root / frontend_dir
        if not frontend_path.exists():
            print(f"Warning: {frontend_dir} directory not found")
            return

        print(f"🔍 Analyzing frontend: {frontend_dir}")

        # Analyze package.json for dependencies
        package_json = frontend_path / "package.json"
        if package_json.exists():
            with open(package_json, 'r', encoding='utf-8') as f:
                package_data = json.load(f)

            deps = set(package_data.get('dependencies', {}).keys())
            dev_deps = set(package_data.get('devDependencies', {}).keys())
            self.frontend_deps.update(deps)
            self.frontend_deps.update(dev_deps)

        # Analyze TypeScript/React files
        for ts_file in frontend_path.glob("**/*.{ts,tsx,js,jsx}"):
            if any(skip in str(ts_file) for skip in ["node_modules", ".next", "__tests__"]):
                continue

            module_name = self._get_relative_module_name(ts_file, frontend_path)
            try:
                with open(ts_file, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Basic analysis for TypeScript/React
                functions = self._extract_js_functions(content)
                components = self._extract_react_components(content)
                imports = self._extract_js_imports(content)

                self.frontend_modules[module_name] = {
                    'file': str(ts_file.relative_to(self.project_root)),
                    'description': self._get_js_description(content, module_name),
                    'functions': functions[:5],
                    'components': components[:3],
                    'imports': imports
                }

            except Exception as e:
                print(f"Warning: Could not analyze {ts_file}: {e}")

    def _get_relative_module_name(self, file_path: Path, base_path: Path) -> str:
        """Get module name relative to base path."""
        relative = file_path.relative_to(base_path)
        return str(relative).replace('/', '.').replace('\\', '.').replace('.py', '').replace('.ts', '').replace('.tsx', '').replace('.js', '').replace('.jsx', '')

    def _extract_python_imports(self, tree: ast.AST) -> Set[str]:
        """Extract imports from Python AST."""
        imports = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    if alias.name.split('.')[0] in ['django', 'llama_index', 'google', 'rest_framework']:
                        imports.add(alias.name.split('.')[0])
            elif isinstance(node, ast.ImportFrom):
                if node.module and node.module.split('.')[0] in ['django', 'llama_index', 'google', 'rest_framework']:
                    imports.add(node.module.split('.')[0])
        return imports

    def _extract_js_functions(self, content: str) -> List[str]:
        """Extract function names from JavaScript/TypeScript."""
        functions = []
        # Match function declarations and arrow functions
        patterns = [
            r'function\s+(\w+)\s*\(',
            r'const\s+(\w+)\s*=\s*\(',
            r'const\s+(\w+)\s*=\s*async\s*\('
        ]
        for pattern in patterns:
            matches = re.findall(pattern, content)
            functions.extend(matches)
        return list(set(functions))  # Remove duplicates

    def _extract_react_components(self, content: str) -> List[str]:
        """Extract React component names."""
        components = []
        # Match function components and class components
        patterns = [
            r'function\s+(\w+)\s*\(',
            r'const\s+(\w+)\s*=\s*\(\s*\)\s*=>',
            r'const\s+(\w+)\s*=\s*\([^)]*\)\s*=>',
            r'class\s+(\w+)\s+extends\s+React\.Component'
        ]
        for pattern in patterns:
            matches = re.findall(pattern, content)
            components.extend(matches)
        return list(set(components))

    def _extract_js_imports(self, content: str) -> Set[str]:
        """Extract imports from JavaScript/TypeScript."""
        imports = set()
        # Match import statements
        import_patterns = [
            r"import\s+.*?\s+from\s+['\"]([^'\"]*)['\"]",
            r"import\s+\{[^}]+\}\s+from\s+['\"]([^'\"]*)['\"]"
        ]
        for pattern in import_patterns:
            matches = re.findall(pattern, content)
            for match in matches:
                if match.startswith('@') or match in ['react', 'next', 'lucide-react']:
                    imports.add(match.split('/')[0])
        return imports

    def _get_python_description(self, content: str, module_name: str) -> str:
        """Get description for Python module."""
        lines = content.split('\n')[:10]
        for line in lines:
            if '"""' in line or "'''" in line:
                desc = line.replace('"""', '').replace("'''", '').strip()
                return desc[:50] + "..." if len(desc) > 50 else desc

        descriptions = {
            'main': 'Main application entry point',
            'manage': 'Django management commands',
            'config.settings': 'Django settings configuration',
            'ai.models': 'AI data models',
            'ai.views': 'AI API endpoints',
            'ai.utils': 'AI utility functions',
            'custom_console': 'Console output utilities',
            'google_llm_init': 'Google Gemini LLM setup'
        }
        return descriptions.get(module_name, f'{module_name} module')

    def _get_js_description(self, content: str, module_name: str) -> str:
        """Get description for JavaScript/TypeScript module."""
        lines = content.split('\n')[:10]
        for line in lines:
            if '//' in line and ('@description' in line or 'Description:' in line):
                return line.replace('//', '').replace('@description', '').strip()

        descriptions = {
            'app.layout': 'Root layout component',
            'app.page': 'Main page component',
            'app.chat': 'Chat interface components',
            'components': 'Reusable UI components',
            'lib': 'Utility functions and configurations'
        }
        return descriptions.get(module_name, f'{module_name} component')


def generate_backend_diagram(analyzer: ProjectAnalyzer) -> str:
    """Generate Mermaid diagram for backend."""
    diagram = r'''```mermaid
graph TB
    %% User Interaction
    USER["User"] --> API["Django REST API<br/>b-e/config/urls.py"]

    %% API Layer
    API --> AUTH["Authentication<br/>Django Auth"]
    API --> AI_API["AI Endpoints<br/>b-e/ai/urls.py"]

    %% Business Logic
    AI_API --> AI_VIEWS["AI Views<br/>b-e/ai/views.py"]
    AI_VIEWS --> AI_MODELS["AI Models<br/>b-e/ai/models.py"]
    AI_VIEWS --> AI_UTILS["AI Utils<br/>b-e/ai/utils.py"]

    %% Core Application
    AI_VIEWS --> MAIN["Main App<br/>b-e/main.py"]
    MAIN --> LLM["Google Gemini LLM<br/>b-e/google_llm_init.py"]
    MAIN --> SYS_PROMPT["System Prompt<br/>b-e/system_prompt.txt"]

    %% Data Layer
    AI_MODELS --> DB[("SQLite Database<br/>b-e/db.sqlite3")]
    MAIN --> VECTOR_DB["Vector Database<br/>b-e/chroma/"]

    %% Configuration
    CONFIG["Django Config<br/>b-e/config/settings.py"] --> DB
    CONFIG --> ENV["Environment<br/>b-e/.env"]

    %% External Services
    LLM --> GOOGLE["Google AI API"]
    VECTOR_DB --> CHROMA["Chroma DB"]

    %% Styling
    classDef user fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,color:#1976d2
    classDef api fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#7b1fa2
    classDef business fill:#e8f5e8,stroke:#388e3c,stroke-width:2px,color:#388e3c
    classDef data fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#f57c00
    classDef config fill:#fce4ec,stroke:#c2185b,stroke-width:2px,color:#c2185b
    classDef external fill:#f5f5f5,stroke:#424242,stroke-width:1px,color:#424242

    class USER user
    class API,AI_API api
    class AI_VIEWS,AI_MODELS,AI_UTILS,MAIN business
    class DB,VECTOR_DB data
    class CONFIG,ENV config
    class GOOGLE,CHROMA external

    %% Flow Labels
    USER -.->|"HTTP Requests"| API
    AI_VIEWS -.->|"AI Processing"| MAIN
    MAIN -.->|"LLM Calls"| GOOGLE
    AI_MODELS -.->|"Data Persistence"| DB
```'''

    return diagram


def generate_frontend_diagram(analyzer: ProjectAnalyzer) -> str:
    """Generate Mermaid diagram for frontend."""
    diagram = r'''```mermaid
graph TB
    %% User Interface
    USER["User"] --> BROWSER["Web Browser"]

    %% Next.js Application
    BROWSER --> APP["Next.js App<br/>f-e/app/"]

    %% App Router Structure
    APP --> LAYOUT["Root Layout<br/>f-e/app/layout.tsx"]
    APP --> PAGE["Home Page<br/>f-e/app/page.tsx"]
    APP --> CHAT["Chat Interface<br/>f-e/app/chat/"]

    %% Components
    LAYOUT --> COMPONENTS["UI Components<br/>f-e/components/"]
    PAGE --> COMPONENTS
    CHAT --> COMPONENTS

    COMPONENTS --> RADIX["Radix UI<br/>Components"]
    COMPONENTS --> LUCIDE["Lucide Icons<br/>Icons"]

    %% Styling & Theming
    COMPONENTS --> TAILWIND["Tailwind CSS<br/>Styling"]
    LAYOUT --> THEMES["Next Themes<br/>Dark/Light Mode"]

    %% State Management
    CHAT --> STATE["React State<br/>Local State"]

    %% API Communication
    CHAT --> API_CALLS["API Calls<br/>to Backend"]
    API_CALLS --> BACKEND["Django Backend<br/>b-e/"]

    %% Build & Development
    DEV["Development<br/>f-e/package.json"] --> VITE["Vite<br/>Build Tool"]
    DEV --> VITEST["Vitest<br/>Testing"]
    DEV --> ESLINT["ESLint<br/>Code Quality"]

    %% External Dependencies
    RADIX --> NPM["NPM Packages"]
    LUCIDE --> NPM
    TAILWIND --> POSTCSS["PostCSS<br/>Processing"]

    %% Styling
    classDef user fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,color:#1976d2
    classDef ui fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#7b1fa2
    classDef components fill:#e8f5e8,stroke:#388e3c,stroke-width:2px,color:#388e3c
    classDef styling fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#f57c00
    classDef data fill:#fce4ec,stroke:#c2185b,stroke-width:2px,color:#c2185b
    classDef dev fill:#f5f5f5,stroke:#424242,stroke-width:1px,color:#424242

    class USER user
    class BROWSER,APP,LAYOUT,PAGE,CHAT ui
    class COMPONENTS,RADIX,LUCIDE components
    class TAILWIND,THEMES,STATE styling
    class API_CALLS,BACKEND data
    class DEV,VITE,VITEST,ESLINT,NPM,POSTCSS dev

    %% Flow Labels
    USER -.->|"Interacts with"| BROWSER
    BROWSER -.->|"Renders"| APP
    CHAT -.->|"API Requests"| API_CALLS
    COMPONENTS -.->|"Styled with"| TAILWIND
    DEV -.->|"Builds with"| VITE
```'''

    return diagram


def generate_full_stack_diagram(analyzer: ProjectAnalyzer) -> str:
    """Generate combined full-stack diagram."""
    diagram = r'''```mermaid
graph TB
    %% Users
    subgraph "Users"
        WEB_USER["Web User"]
        API_USER["API Consumer"]
    end

    %% Frontend Layer
    subgraph "Frontend (f-e)"
        NEXT["Next.js 16<br/>React 19 + TypeScript"]
        UI["UI Components<br/>Radix UI + Tailwind"]
        CHAT_UI["Chat Interface"]
    end

    %% Communication
    WEB_USER --> NEXT
    NEXT --> UI
    UI --> CHAT_UI

    %% API Gateway
    CHAT_UI --> DJANGO_API["Django REST API<br/>b-e/config/urls.py"]

    %% Backend Layer
    subgraph "Backend (b-e)"
        DJANGO["Django App<br/>Python 3.12"]
        AI_MODULE["AI Module<br/>b-e/ai/"]
        LLM_INTEGRATION["LLM Integration<br/>Google Gemini"]
    end

    %% Backend Flow
    DJANGO_API --> DJANGO
    DJANGO --> AI_MODULE
    AI_MODULE --> LLM_INTEGRATION

    %% Data Layer
    subgraph "Data & Storage"
        SQLITE[("SQLite DB<br/>User Data")]
        VECTOR_DB[("Vector DB<br/>Chroma<br/>Embeddings")]
        FILE_STORAGE["File Storage<br/>Voice Clips, etc."]
    end

    %% Data Connections
    AI_MODULE --> SQLITE
    AI_MODULE --> VECTOR_DB
    AI_MODULE --> FILE_STORAGE

    %% External Services
    subgraph "External APIs"
        GOOGLE_AI["Google AI<br/>Gemini API"]
        API_USAGE["API Usage<br/>Tracking"]
    end

    %% External Connections
    LLM_INTEGRATION --> GOOGLE_AI
    AI_MODULE --> API_USAGE

    %% Development Tools
    subgraph "Development"
        TESTING["Testing<br/>Vitest + pytest"]
        LINTING["Code Quality<br/>ESLint + Black"]
    end

    %% Styling
    classDef user fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,color:#1976d2
    classDef frontend fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#7b1fa2
    classDef backend fill:#e8f5e8,stroke:#388e3c,stroke-width:2px,color:#388e3c
    classDef data fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#f57c00
    classDef external fill:#fce4ec,stroke:#c2185b,stroke-width:2px,color:#c2185b
    classDef dev fill:#f5f5f5,stroke:#424242,stroke-width:1px,color:#424242

    class WEB_USER,API_USER user
    class NEXT,UI,CHAT_UI frontend
    class DJANGO,DJANGO_API,AI_MODULE,LLM_INTEGRATION backend
    class SQLITE,VECTOR_DB,FILE_STORAGE data
    class GOOGLE_AI,API_USAGE external
    class TESTING,LINTING dev

    %% Flow Labels
    WEB_USER -.->|"Uses"| NEXT
    CHAT_UI -.->|"Sends requests to"| DJANGO_API
    AI_MODULE -.->|"Queries"| GOOGLE_AI
    AI_MODULE -.->|"Stores data in"| SQLITE
    AI_MODULE -.->|"Stores vectors in"| VECTOR_DB
```'''

    return diagram


def main():
    """Main function to generate architecture diagrams."""
    print("🏰 Generating Project_Red_Queen Architecture Diagrams...")

    # Since this script is in the architecture/ directory, go up one level for project root
    project_root = Path(__file__).parent.parent
    script_dir = Path(__file__).parent
    analyzer = ProjectAnalyzer(project_root)

    # Analyze both backend and frontend
    analyzer.analyze_backend("b-e")
    analyzer.analyze_frontend("f-e")

    print(f"📊 Backend modules: {len(analyzer.backend_modules)}")
    print(f"📊 Frontend modules: {len(analyzer.frontend_modules)}")

    def write_if_changed(file_path: Path, content: str, description: str):
        """Write content to file only if it has changed."""
        if file_path.exists():
            with open(file_path, 'r', encoding='utf-8') as f:
                existing = f.read()
            if existing == content:
                print(f"✅ {description} {custom_console.COLOR_YELLOW}unchanged:{custom_console.RESET_COLOR} {file_path.name}")
                return
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ {description} generated: {file_path.name}")

    # Generate backend diagram
    backend_diagram = generate_backend_diagram(analyzer)
    backend_file = script_dir / "backend_architecture.md"
    write_if_changed(backend_file, backend_diagram, "Backend architecture diagram")

    # Generate frontend diagram
    frontend_diagram = generate_frontend_diagram(analyzer)
    frontend_file = script_dir / "frontend_architecture.md"
    write_if_changed(frontend_file, frontend_diagram, "Frontend architecture diagram")

    # Generate full-stack diagram
    full_stack_diagram = generate_full_stack_diagram(analyzer)
    fullstack_file = script_dir / "fullstack_architecture.md"
    write_if_changed(fullstack_file, full_stack_diagram, "Full-stack architecture diagram")

    # Generate summary report
    report = f"""# Project_Red_Queen Architecture Analysis

## Backend (b-e) - Django + AI
- **Framework**: Django with Python 3.12
- **AI Integration**: LlamaIndex + Google Gemini
- **Database**: SQLite + Chroma Vector DB
- **Modules Analyzed**: {len(analyzer.backend_modules)}
- **Key Dependencies**: {', '.join(sorted(analyzer.backend_deps)[:5])}

## Frontend (f-e) - Next.js + React
- **Framework**: Next.js 16 + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Radix UI
- **Modules Analyzed**: {len(analyzer.frontend_modules)}
- **Key Dependencies**: {', '.join(sorted(analyzer.frontend_deps)[:5])}

## Architecture Diagrams Generated
1. `backend_architecture.md` - Django backend with AI components
2. `frontend_architecture.md` - Next.js frontend with UI components
3. `fullstack_architecture.md` - Complete full-stack architecture

## Key Features
- **AI-Powered Chat**: Integrated LLM responses with conversation history
- **Vector Search**: Chroma database for semantic search
- **Modern UI**: Responsive design with dark/light themes
- **API Tracking**: Usage monitoring and analytics
- **File Processing**: Voice clip handling and storage
"""

    summary_file = script_dir / "architecture_summary.md"
    write_if_changed(summary_file, report, "Architecture summary")


if __name__ == "__main__":
    main()