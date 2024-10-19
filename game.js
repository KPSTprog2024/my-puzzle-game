// シーン1: 表示時間選択画面と難易度・モード選択
class SelectionScene extends Phaser.Scene {
    // ...（コード省略）
}

// シーン2: カウントダウン
class CountdownScene extends Phaser.Scene {
    // ...（コード省略）
}

// シーン3: ゲームプレイ画面
class GameScene extends Phaser.Scene {
    // ...（コード省略）
}

// シーン4: クリア画面
class ClearScene extends Phaser.Scene {
    // ...（コード省略）
}

// シーン5: リトライ画面（ゲームオーバー画面）
class RetryScene extends Phaser.Scene {
    // ...（コード省略）
}

// Phaserの設定
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#f0f8ff',
    scene: [SelectionScene, CountdownScene, GameScene, ClearScene, RetryScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight
    }
};

// ゲームインスタンスの作成
const game = new Phaser.Game(config);

// ウィンドウリサイズ時の対応
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
