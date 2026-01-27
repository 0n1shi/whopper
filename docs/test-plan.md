# テスト拡充計画

## 現状サマリー

| 項目 | 状況 |
|------|------|
| テストフレームワーク | Vitest v4.0.16 |
| 既存テスト数 | 32個（すべてパス） |
| テスト済みモジュール | `src/analyzer/` のみ |
| 未テストのコード | 約90% |

### 既存テストファイル

- `src/analyzer/index.test.ts` - 分析メインロジック（5テスト）
- `src/analyzer/apply.test.ts` - 署名適用ロジック（18テスト）
- `src/analyzer/match.test.ts` - マッチング・バージョン抽出（9テスト）

## 拡充対象と優先度

### 優先度 高

| # | 対象モジュール | 内容 | 理由 |
|---|---------------|------|------|
| 1 | `src/browser/` | Playwright操作のユニットテスト（モック使用） | コア機能、エラーハンドリング重要 |
| 2 | `src/commands/detect_utils.ts` | 出力フォーマット関数のテスト | 純粋関数、テストしやすい |
| 3 | `src/logger/` | ログ機能のテスト | 副作用の確認 |

### 優先度 中

| # | 対象モジュール | 内容 | 理由 |
|---|---------------|------|------|
| 4 | `src/commands/detect.ts` | 検出コマンドの統合テスト | エラーケースの網羅 |
| 5 | `src/signatures/utils.ts` | 署名ユーティリティのテスト | データ整合性 |
| 6 | `src/cli.ts` | CLIパース・ディスパッチのテスト | 入口の信頼性 |

### 優先度 低

| # | 対象モジュール | 内容 | 理由 |
|---|---------------|------|------|
| 7 | `src/signatures/` | 署名データのバリデーションテスト | データ品質確認 |
| 8 | E2Eテスト | 実サイトでの検出テスト | CI/CD時間の考慮必要 |

## 実装アプローチ

### 1. ブラウザモジュール (`src/browser/`)

- Playwrightをモック化
- テスト対象:
  - `openPage()`: レスポンス収集、Cookie抽出
  - エラーハンドリング（タイムアウト、ネットワークエラー等）
  - `sleep()`: 非同期タイミング制御

### 2. コマンドモジュール (`src/commands/`)

- `detect_utils.ts`: 出力フォーマット関数の単体テスト
  - JSON出力形式
  - テキスト出力形式
  - エッジケース（空の結果、大量の結果等）
- `detect.ts`: 統合テスト
  - 正常系フロー
  - Playwrightインストールエラー
  - 無効なURL

### 3. ロガー (`src/logger/`)

- コンソール出力をモック
- 各ログレベル（debug, info, warn, error）の動作確認
- ログレベル制御の確認

### 4. CLI (`src/cli.ts`)

- コマンド引数のパース
- `--help`, `--version` フラグの処理
- 不正な引数のエラーハンドリング

### 5. 署名システム (`src/signatures/`)

- スキーマバリデーション
  - 必須フィールドの存在確認
  - 型チェック
  - 正規表現の妥当性

## 進捗管理

- [ ] `src/browser/index.test.ts` - Playwrightモック化が複雑なため保留
- [x] `src/commands/detect_utils.test.ts` - 完了 (23テスト)
- [x] `src/logger/index.test.ts` - 完了 (12テスト)
- [x] `src/logger/utils.test.ts` - 完了 (2テスト)
- [ ] `src/commands/detect.test.ts` - Playwrightモック化が複雑なため保留
- [x] `src/signatures/utils.test.ts` - 完了 (6テスト)
- [x] `src/cli.test.ts` - 完了 (4テスト)
- [x] `src/commands/banner.test.ts` - 完了 (4テスト)
- [x] `src/commands/version.test.ts` - 完了 (3テスト)
- [x] `src/browser/utils.test.ts` - 完了 (3テスト)
- [ ] 署名バリデーションテスト
- [ ] E2Eテスト

### 現在のテスト状況
- **合計テスト数**: 89個 (32個 → 89個)
- **カバレッジ**: 98%以上

## メモ

- テスト実行: `npm test`
- カバレッジレポート: `coverage/` ディレクトリに出力
