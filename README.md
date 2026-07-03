# ClaudeCode_MCP_QA_Automation_RestAPI
 REST API Testing | Claude Code + Playwright MCP

## Run Swagger UI

From the repository root:

```powershell
cd product-api
.\gradlew.bat bootRun
```

Then open:

- Swagger UI: `http://localhost:8082/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8082/v3/api-docs`

To build and run the jar instead:

```powershell
cd product-api
.\gradlew.bat clean bootJar
java -jar build\libs\product-api-1.0.0.jar
```
