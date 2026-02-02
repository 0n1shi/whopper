# Add Signature

新しいテクノロジーシグネチャを `src/signatures/technologies/` に追加します。

## 手順

1. **ユーザーに確認**: 追加したいテクノロジーの名前を確認してください
2. **情報収集**: 以下の情報をユーザーに確認してください：
   - テクノロジー名（例: jQuery, Nginx）
   - 説明（簡潔な説明文）
   - CPE 2.2（Common Platform Enumeration）（任意）
     - **インターネットで検索して正しいCPEを探してください**
     - フォーマット: `cpe:/<part>:<vendor>:<product>:<version>`
     - 例: `cpe:/a:jquery:jquery`, `cpe:/a:nginx:nginx`
     - 参考: [NVD CPE Dictionary](https://nvd.nist.gov/products/cpe)
   - 検出ルール:
     - confidence: "high" | "medium" | "low"
     - headers: HTTPヘッダーの正規表現マッチング（任意）
     - bodies: HTMLボディの正規表現マッチング（任意）
     - urls: URLパスの正規表現マッチング（任意）
     - cookies: Cookieの正規表現マッチング（任意）
     - javascriptVariables: JavaScript変数の正規表現マッチング（任意）

3. **既存シグネチャの参考**: 既存のシグネチャファイルを参考にしてください
   - サーバー検出の例: `src/signatures/technologies/nginx.ts`
   - JavaScript検出の例: `src/signatures/technologies/jquery.ts`

4. **ファイル作成**: `src/signatures/technologies/{snake_case_name}.ts` に新しいファイルを作成

   ```typescript
   import type { Signature } from "../_types.js";

   export const {camelCase}Signature: Signature = {
     name: "{テクノロジー名}",
     description: "{説明}",
     cpe: "{CPE}",  // 任意
     rule: {
       confidence: "{high|medium|low}",
       // 以下から適切なものを選択
       headers: { ... },
       bodies: [ ... ],
       urls: [ ... ],
       cookies: { ... },
       javascriptVariables: { ... },
     },
   };
   ```

5. **index.ts に登録**: `src/signatures/index.ts` を編集
   - import文を追加（アルファベット順を推奨）
   - `signatures` 配列にエクスポートを追加（アルファベット順を推奨）

6. **ビルド確認**: `npm run build` でビルドが通ることを確認

## 型定義

```typescript
type Confidence = "high" | "medium" | "low";
type Regex = string;

type Rule = {
  confidence: Confidence;
  headers?: Record<string, Regex>;
  bodies?: Regex[];
  urls?: Regex[];
  cookies?: Record<string, Regex>;
  javascriptVariables?: Record<string, Regex>;
};

type Signature = {
  name: string;
  description?: string;
  cpe?: string;
  rule?: Rule;
  impliedSoftwares?: string[];
};
```

## 注意事項

- ファイル名はスネークケース（例: `jquery_ui.ts`）
- export名はキャメルケース + `Signature`（例: `jqueryUiSignature`）
- 正規表現でバージョンをキャプチャする場合は `(\\d+\\.\\d+\\.\\d+)` を使用
- import/exportの際は `.js` 拡張子を使用（ESM対応）
- **CPEは必ずCPE 2.2フォーマットを使用**（CPE 2.3ではない）
  - CPE 2.2: `cpe:/a:vendor:product:version`
  - CPE 2.3: `cpe:2.3:a:vendor:product:version:...`（使用しない）
