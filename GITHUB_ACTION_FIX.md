# Correções do GitHub Action para Executável Único

## Problema
O GitHub Action estava falhando porque estava tentando acessar `dist/pokemacro/` (estrutura de pasta), mas o novo `main.spec` gera apenas `dist/pokemacro.exe` (executável único).

## Mudanças Implementadas

### 1. GitHub Action (`.github/workflows/build-release.yml`)

**Antes:**
```powershell
echo "Contents of pokemacro folder:"
dir dist/pokemacro
echo "Size of executable:"
powershell "Get-ChildItem dist/pokemacro/pokemacro.exe | Select-Object Name, Length"

# Create Release Archive
powershell "Compress-Archive -Path 'dist/pokemacro/*' -DestinationPath 'pokemacro-release.zip'"
```

**Depois:**
```powershell
# Verifica ambos os formatos (executável único ou pasta)
if (Test-Path "dist/pokemacro.exe") {
    echo "✓ Single executable found: dist/pokemacro.exe"
    # Lógica para executável único
} else {
    echo "✗ Single executable NOT found, checking legacy structure..."
    # Fallback para estrutura de pasta
}

# Archive criado baseado no que foi encontrado
if (Test-Path "dist/pokemacro.exe") {
    powershell "Compress-Archive -Path 'dist/pokemacro.exe' -DestinationPath 'pokemacro-release.zip'"
} else {
    powershell "Compress-Archive -Path 'dist/pokemacro/*' -DestinationPath 'pokemacro-release.zip'"
}
```

### 2. Verificações Adicionadas

- ✅ **Compatibilidade**: Suporta tanto executável único quanto estrutura de pasta
- ✅ **Debug melhorado**: Logs detalhados sobre o que foi encontrado
- ✅ **Informações de arquivo**: Tamanho do executável e arquivo de release
- ✅ **Tratamento de erro**: Falha graciosamente se nenhum formato for encontrado

### 3. Configuração Atual

**main.spec (correto para executável único):**
```python
exe = EXE(
    pyz,
    a.scripts,
    a.binaries,     # Tudo incluído no EXE
    a.zipfiles,     # Tudo incluído no EXE  
    a.datas,        # Tudo incluído no EXE
    [],
    name='pokemacro',
    # ... outras configurações
)
# Sem COLLECT = executável único
```

**Pipfile build command (correto):**
```toml
build = "npm run build --prefix app && pyinstaller main.spec"
```

## Resultado Esperado

1. **Build**: `pipenv run build` deve gerar `dist/pokemacro.exe` (~428MB)
2. **GitHub Action**: Deve detectar o executável único e criar `pokemacro-release.zip`
3. **Release**: O arquivo zip deve conter apenas `pokemacro.exe`

## Vantagens do Executável Único

- ✅ **Distribuição mais simples**: Um único arquivo
- ✅ **Updater compatível**: Modificações feitas no updater para suportar single exe
- ✅ **AppData funcionando**: Configurações persistem independente da versão
- ✅ **Menor complexidade**: Não há _internal folders para gerenciar

O GitHub Action agora deve funcionar corretamente com qualquer formato de build!
