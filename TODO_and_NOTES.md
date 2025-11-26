# 代辦及應注意事項

> 檔案位置：`TODO_and_NOTES.md`（專案根目錄）

---

## 一、目前已知與已完成（我已記錄）

- 專案資料夾（`pages/`）包含以下 HTML 檔案：
  - `home.html`
  - `about.html`
  - `contact.html`
  - `feedback.html`
  - `sign_in.html`
  - `sign_up.html`
  - `privacy.html`
  - `terms.html`
  - `main.html` （內容為服務總覽）

- Draw.io (mcp-router) 可用的工具（我可見並使用過）：
  - `get-selected-cell`, `list-paged-model`（列出圖表）、
  - `add-rectangle`（新增矩形節點）、`add-edge`（新增連線）、
  - `delete-cell-by-id`（刪除節點）、
  - `get-shape-by-name`, `get-shape-categories`, `get-shapes-in-category`（形狀庫）、
  - `convert_to_markdown`（把 file:// 資源轉成 Markdown）

- 我已在 draw.io 上完成的操作：
  - 新增節點 `contact us`、`sitemap`、`privacy policy`、`terms of service`，節點 ID（mcp 回傳）：
    - `meuTctchg6iPVamGKmln-1` => `contact us`
    - `meuTctchg6iPVamGKmln-2` => `sitemap`
    - `meuTctchg6iPVamGKmln-3` => `privacy policy`
    - `meuTctchg6iPVamGKmln-4` => `terms of service`
  - 已將以上節點連回 `Home`（ID: `qwucuTIfQEHMQRLYkeTW-1`）。

- 我用 `convert_to_markdown` 讀出 `pages/main.html` 的內容，內容確實為服務總覽（範例：汽車維修 / 洗車 / 配件 / 檢測）。

- 專案需求（任務要求）：網站需至少 15 個 HTML 頁面。經比對後，目前圖中與工作區總頁數已達 **16 頁**（含我在 draw.io 中新增的節點），因此頁數已滿足，但仍需確認所有實體檔案對應存在且連結正確。

---

## 二、待辦事項（建議執行順序）

請在離開外出前先確認您要採哪一個策略（我可以接著執行）：

1. 檔案命名與連結一致性
   - [ ] 檢查 `pages/main.html` 是否已手動更名為 `pages/services.html`（或其他名稱）。若尚未更名，請選擇要我替您執行自動更名，或您自行更名。
   - [ ] 更新所有指向 `main.html` 或 `#main` 的連結為新的檔名或 fragment（例如把 `href="#main"` 改為 `href="pages/services.html"` 或 `href="#services"`）。

2. Draw.io 圖表同步（可選）
   - [ ] 若您更改了檔名，請把 draw.io 中對應節點標籤更改為相同名稱（例如 `services` → `services.html` 或 `Services Overview`），以免混淆。

3. 檢查並修正內部連結
   - [ ] 在整個專案中搜尋所有指向 `main.html`、`#main`、或 `#services` 的連結
   - [ ] 測試每一個主要導覽連結（首頁、服務、註冊、登入、聯絡、意見反饋、隱私、條款）是否導向正確頁面

4. Git 與備份
   - [ ] 在做大量檔案改動前，建立 branch 或至少 commit 一次（例如 `git checkout -b rename-services`）
   - [ ] 若您在不同電腦編輯，請先把改動 push 到遠端再在另一台 pull（或使用 zip 備份）

5. 測試
   - [ ] 在本機使用瀏覽器（或簡單的本地 server）檢查相對路徑是否正確（特別是 `base` 標籤使用情況）

---

## 三、具體操作命令（PowerShell / Windows）

- 搜尋專案中所有引用 `main.html`：

```powershell
# 在專案資料夾執行
Select-String -Path .\**\*.html -Pattern 'main.html' -SimpleMatch -List
Select-String -Path .\**\*.html -Pattern '#main' -SimpleMatch -List
```

- 若要將 `pages/main.html` 更名為 `pages/services.html`（在您確認要更名時執行）：

```powershell
Rename-Item -Path .\pages\main.html -NewName services.html
```

- 在更名後，搜尋並替換連結（範例：把 `href="pages/main.html"` 改為 `href="pages/services.html"`）可以用 PowerShell 的批次替換：

```powershell
Get-ChildItem -Path . -Include *.html -Recurse | ForEach-Object {
  (Get-Content $_.FullName) -replace 'pages/main.html','pages/services.html' | Set-Content $_.FullName
}
```

- 建立新的 Git branch 並提交：

```powershell
git add -A
git commit -m "Rename main.html → services.html and update links"
git push -u origin another
```

---

## 四、應注意的事情（風險、常見問題與調整建議）

- 相對路徑與 `base` 標籤：
  - 您的 `index.html` 中有一段 script 在動態加入 `<base href="...">`。若更換檔案位置或使用 fragment（`#...`），請確認 `base` 不會導致連結解析錯誤。

- Draw.io 與實際檔案不同步：
  - 我已替您在 draw.io 新增/調整節點；若您在本機改了檔名，請手動或授權我把 draw.io 中對應節點名稱同步，以免未來看圖時混淆。

- 備份與版本控制：
  - 在執行自動搜尋取代前，務必 commit 或備份。

- 測試流程：
  - 更名或大量修改後，請在本機打開 `index.html` 測試各導覽路徑是否正確，並在必要時清除瀏覽器快取。

- MCP draw.io 連線狀態：
  - 若您要我進一步操作 draw.io（改節點標籤或重新排版），請確保 draw.io MCP server 在您要操作時仍然運作並且瀏覽器已打開該圖表（以免 MCP 呼叫失敗）。

---

## 五、下一步（我可代勞的項目）

若您授權，我可以：

- 自動把 `pages/main.html` 重新命名為 `pages/services.html`，並更新所有連結（包含 `index.html`）；我會先建立一個新的 git branch、commit 變更並回報。  
- 或者：只幫您把 draw.io 節點標籤改為 `services.html`（或 `Services Overview`），不變更檔案系統。

---

## 六、聯絡/恢復上下文（當您回來時）

如果您在另一台筆電上繼續工作，請提供：

- 您是否已在本機或遠端把 `main.html` 更名？（若更名，請告訴我新檔名）
- 您是否已 commit 並 push 您的手動更改？  

回來後我會使用 draw.io MCP 工具重新載入圖表並同步節點文字（如您需要）。

---

最後提醒：在您外出期間我會暫停進一步自動更改。您回來時告訴我要採哪個選項（自動更名或僅同步圖表），我就繼續。祝您外出順利！
