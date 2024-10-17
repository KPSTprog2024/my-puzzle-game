// シーン1: スタート画面
class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        // 必要なアセットをここで読み込む
    }

    create() {
        const { width, height } = this.scale;

        // タイトル
        this.add.text(width / 2, height / 3, 'NumberMemory', {
            fontSize: '64px',
            fill: '#000'
        }).setOrigin(0.5);

        // スタートボタン
        const startButton = this.add.text(width / 2, height / 2, 'はじめる', {
            fontSize: '48px',
            fill: '#fff',
            backgroundColor: '#4CAF50',
            padding: { x: 20, y: 10 },
            borderRadius: 10
        }).setOrigin(0.5).setInteractive();

        startButton.on('pointerdown', () => {
            this.scene.start('SelectionScene');
        });
    }
}

// シーン2: 表示時間選択画面
class SelectionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SelectionScene' });
    }

    create() {
        const { width, height } = this.scale;

        this.add.text(width / 2, height / 4, '表示時間を選んでね', {
            fontSize: '48px',
            fill: '#000'
        }).setOrigin(0.5);

        const times = [
            { label: '0.5びょう', value: 500 },
            { label: '1びょう', value: 1000 },
            { label: '3びょう', value: 3000 }
        ];

        times.forEach((time, index) => {
            const button = this.add.text(width / 2, height / 2 + index * 100, time.label, {
                fontSize: '36px',
                fill: '#fff',
                backgroundColor: '#2196F3',
                padding: { x: 20, y: 10 },
                borderRadius: 10
            }).setOrigin(0.5).setInteractive();

            button.on('pointerdown', () => {
                this.scene.start('CountdownScene', { displayTime: time.value });
            });
        });
    }
}

// シーン3: カウントダウン
class CountdownScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CountdownScene' });
    }

    init(data) {
        this.displayTime = data.displayTime;
    }

    create() {
        const { width, height } = this.scale;
        this.count = 3;

        this.countText = this.add.text(width / 2, height / 2, this.count, {
            fontSize: '100px',
            fill: '#FF0000'
        }).setOrigin(0.5);

        this.timeEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateCountdown,
            callbackScope: this,
            loop: true
        });
    }

    updateCountdown() {
        this.count -= 1;
        if (this.count > 0) {
            this.countText.setText(this.count);
        } else {
            this.timeEvent.remove(false);
            this.scene.start('GameScene', { displayTime: this.displayTime, level: 1 });
        }
    }
}

// シーン4: ゲームプレイ画面
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        this.displayTime = data.displayTime;
        this.level = data.level;
        this.expectedNumber = 1;
        this.numbers = [];
    }

    create() {
        const { width, height } = this.scale;
        this.add.text(50, 50, `レベル: ${this.level}`, {
            fontSize: '32px',
            fill: '#000'
        });

        // 生成する数字のリスト
        this.numbers = [];
        for (let i = 1; i <= this.level + 2; i++) { // 最初は3つ
            this.numbers.push(i);
        }

        // 数字をシャッフル
        Phaser.Utils.Array.Shuffle(this.numbers);

        // グリッドの設定
        const gridCols = Math.ceil(Math.sqrt(this.numbers.length));
        const gridRows = Math.ceil(this.numbers.length / gridCols);
        const gridWidth = width * 0.8;
        const gridHeight = height * 0.6;
        const cellWidth = gridWidth / gridCols;
        const cellHeight = gridHeight / gridRows;

        this.numberObjects = [];

        this.numbers.forEach((num, index) => {
            const col = index % gridCols;
            const row = Math.floor(index / gridCols);
            const x = (width - gridWidth) / 2 + col * cellWidth + cellWidth / 2;
            const y = height / 2 - gridHeight / 2 + row * cellHeight + cellHeight / 2;

            const numberText = this.add.text(x, y, num, {
                fontSize: '48px',
                fill: '#fff',
                backgroundColor: '#FF5722',
                padding: { x: 20, y: 20 },
                borderRadius: 10
            }).setOrigin(0.5).setInteractive();

            numberText.on('pointerdown', () => {
                this.handleNumberClick(num, numberText);
            });

            this.numberObjects.push(numberText);
        });

        // 数字を一定時間後に消す
        this.time.delayedCall(this.displayTime, () => {
            this.numberObjects.forEach(obj => obj.setVisible(false));
        }, [], this);
    }

    handleNumberClick(num, obj) {
        if (num === this.expectedNumber) {
            // 正しいタッチ
            obj.setStyle({ backgroundColor: '#4CAF50' });
            this.expectedNumber += 1;
            if (this.expectedNumber > this.level + 2) {
                // レベルクリア
                this.scene.start('ClearScene', { displayTime: this.displayTime, level: this.level });
            }
        } else {
            // 間違ったタッチ
            this.scene.start('RetryScene', { displayTime: this.displayTime, level: this.level });
        }
    }
}

// シーン5: クリア画面
class ClearScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ClearScene' });
    }

    init(data) {
        this.displayTime = data.displayTime;
        this.level = data.level;
        this.messages = [
            'すごい！',
            'よくできた！',
            'ナイス！',
            'かんせい！',
            'がんばったね！',
            'きらきら！',
            'ピカピカ！',
            'スマート！',
            'トップだ！',
            'ファンタスティック！'
        ];
    }

    create() {
        const { width, height } = this.scale;

        // クリアテキスト
        this.add.text(width / 2, height / 3, 'クリア！', {
            fontSize: '64px',
            fill: '#FFD700'
        }).setOrigin(0.5);

        // ランダムメッセージ
        const randomMessage = Phaser.Utils.Array.GetRandom(this.messages);
        this.add.text(width / 2, height / 2, randomMessage, {
            fontSize: '48px',
            fill: '#000'
        }).setOrigin(0.5);

        // エフェクト（簡易的な花火）
        for (let i = 0; i < 20; i++) {
            this.time.delayedCall(100, () => {
                const particle = this.add.circle(
                    Phaser.Math.Between(0, width),
                    Phaser.Math.Between(0, height),
                    Phaser.Math.Between(2, 6),
                    Phaser.Display.Color.RandomRGB().color
                );
                this.tweens.add({
                    targets: particle,
                    alpha: 0,
                    scale: { from: 1, to: 3 },
                    duration: 1000,
                    onComplete: () => particle.destroy()
                });
            }, [i * 100], this);
        }

        // 次のレベルへ自動遷移
        this.time.delayedCall(3000, () => {
            this.scene.start('GameScene', { displayTime: this.displayTime, level: this.level + 1 });
        }, [], this);
    }
}

// シーン6: リトライ画面（ゲームオーバー画面）
class RetryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'RetryScene' });
    }

    init(data) {
        this.displayTime = data.displayTime;
        this.level = data.level;
    }

    create() {
        const { width, height } = this.scale;

        // ゲームオーバーのテキスト
        this.add.text(width / 2, height / 3, 'ゲームオーバー', {
            fontSize: '64px',
            fill: '#FF0000'
        }).setOrigin(0.5);

        // 「もういちど」ボタン
        const retryButton = this.add.text(width / 2, height / 2, 'もういちど', {
            fontSize: '48px',
            fill: '#fff',
            backgroundColor: '#FF5722',
            padding: { x: 20, y: 10 },
            borderRadius: 10
        }).setOrigin(0.5).setInteractive();

        retryButton.on('pointerdown', () => {
            this.scene.start('GameScene', { displayTime: this.displayTime, level: this.level });
        });

        // 「さいしょから」ボタン
        const restartButton = this.add.text(width / 2, height / 2 + 100, 'さいしょから', {
            fontSize: '48px',
            fill: '#fff',
            backgroundColor: '#2196F3',
            padding: { x: 20, y: 10 },
            borderRadius: 10
        }).setOrigin(0.5).setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.start('GameScene', { displayTime: this.displayTime, level: 1 });
        });
    }
}

// Phaserの設定
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#f0f8ff',
    scene: [StartScene, SelectionScene, CountdownScene, GameScene, ClearScene, RetryScene],
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

// ゲームインスタンスの作成
const game = new Phaser.Game(config);
