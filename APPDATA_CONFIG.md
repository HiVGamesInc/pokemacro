# Sistema de Configuração AppData - Pokemacro

## Resumo das Mudanças

O sistema de configuração do Pokemacro foi modificado para armazenar os arquivos JSON de configuração do usuário no diretório AppData do Windows, garantindo que as configurações persistam independentemente da versão da aplicação.

## Como Funciona

### Localização dos Arquivos

**Arquivos de Configuração do Usuário** (salvos no AppData):

- `alertConfig.json`
- `healConfig.json`
- `keybindings.json`
- `todoConfig.json`
- `weeklyTodoConfig.json`
- `autocatch.json`
- `autorevive.json`
- `autocombo.json`

**Localização no Windows:**

```
%APPDATA%\Pokemacro\
```

Exemplo: `C:\Users\SeuUsuario\AppData\Roaming\Pokemacro\`

**Arquivos Padrão** (bundled com a aplicação):

- `configs/defaultAlertConfig.json`
- `configs/defaultHealConfig.json`
- `configs/defaultKeybindings.json`
- `configs/defaultTodoConfig.json`
- `configs/defaultWeeklyTodoConfig.json`
- `configs/defaultCombo.json`

### Compatibilidade Multiplataforma

- **Windows:** `%APPDATA%\Pokemacro\`
- **Linux/Mac:** `~/.pokemacro/`

## Arquivos Modificados

### `modules/utils.py`

- Adicionada função `get_appdata_path()` para obter o diretório correto
- Adicionada função `is_user_config_file()` para identificar arquivos de usuário
- Modificada função `resource_path()` para direcionar arquivos de usuário para AppData
- Modificada função `save_debug_image()` para salvar no AppData

### `modules/__init__.py`

- Adicionada função `initialize_config_system()` para garantir que o diretório AppData exista
- Inicialização automática quando o módulo é importado

## Benefícios

1. **Persistência Entre Versões:** As configurações do usuário não são perdidas ao atualizar o Pokemacro
2. **Padrão do Windows:** Segue as convenções padrão do Windows para dados de aplicação
3. **Organização:** Separação clara entre arquivos de configuração padrão e personalizados
4. **Compatibilidade:** Funciona tanto em desenvolvimento quanto em executáveis PyInstaller

## Teste

Execute o script de teste para verificar se o sistema está funcionando:

```bash
python test_appdata.py
```

O script irá:

1. Verificar se o diretório AppData foi criado
2. Testar salvamento e carregamento de arquivos
3. Listar arquivos no diretório AppData
4. Mostrar o caminho completo onde as configurações são armazenadas

## Comportamento do Sistema

1. **Primeira Execução:** O diretório `%APPDATA%\Pokemacro\` é criado automaticamente
2. **Salvamento:** Todos os arquivos de configuração do usuário são salvos no AppData
3. **Carregamento:** O sistema primeiro procura no AppData, depois nos arquivos padrão
4. **Compatibilidade:** Arquivos padrão (configs/) continuam funcionando normalmente

## Estrutura de Diretórios

```
%APPDATA%\Pokemacro\
├── alertConfig.json
├── healConfig.json
├── keybindings.json
├── todoConfig.json
├── weeklyTodoConfig.json
├── autocatch.json
├── autorevive.json
├── autocombo.json
└── debug_images\
    ├── debug_1.png
    ├── debug_2.png
    └── ...
```

## Notas Importantes

- O sistema mantém compatibilidade total com a versão anterior
- Não há migração automática de arquivos existentes (conforme solicitado)
- Os arquivos de configuração padrão permanecem bundled com a aplicação
- O sistema funciona tanto em desenvolvimento quanto em produção
