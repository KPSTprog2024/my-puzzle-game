// シーン1: 表示時間選択画面
class SelectionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SelectionScene' });
    }

    create() {
        const { width, height } = this.scale;

        // タイトル
        this.add.text(width / 2, height / 4, 'ひょうじじかんをえらんでね', {
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
                this.scene.start('CountdownScene', { displayTime: time.value, level: 1 });
            });
        });
    }
}

// シーン2: カウントダウン
class CountdownScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CountdownScene' });
    }

    init(data) {
        this.displayTime = data.displayTime;
        this.level = data.level;
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
            this.scene.start('GameScene', { displayTime: this.displayTime, level: this.level });
        }
    }
}

// シーン3: ゲームプレイ画面
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        this.displayTime = data.displayTime;
        this.level = data.level;
        this.expectedNumber = 1;
        this.numbers = [];
        this.gridSize = 5; // 縦横のマス数
        this.grid = []; // グリッドセルの情報
    }

    create() {
        const { width, height } = this.scale;

        // レベル表示
        this.add.text(50, 50, `れべる: ${this.level}`, {
            fontSize: '32px',
            fill: '#000'
        });

        // グリッドの描画
        this.drawGrid();

        // 数字の配置
        this.placeNumbers();

        // 数字を一定時間後に消す
        this.time.delayedCall(this.displayTime, () => {
            this.hideNumbers();
        }, [], this);
    }

    drawGrid() {
        const { width, height } = this.scale;
        const gridWidth = width * 0.8;
        const gridHeight = height * 0.8;
        const startX = (width - gridWidth) / 2;
        const startY = (height - gridHeight) / 2;
        const cellWidth = gridWidth / this.gridSize;
        const cellHeight = gridHeight / this.gridSize;

        // グリッドの線を描画
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0x000000, 1);

        // 縦線
        for (let i = 0; i <= this.gridSize; i++) {
            graphics.moveTo(startX + i * cellWidth, startY);
            graphics.lineTo(startX + i * cellWidth, startY + gridHeight);
        }

        // 横線
        for (let i = 0; i <= this.gridSize; i++) {
            graphics.moveTo(startX, startY + i * cellHeight);
            graphics.lineTo(startX + gridWidth, startY + i * cellHeight);
        }

        graphics.strokePath();

        // グリッドセルのクリックエリアを設定
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const x = startX + col * cellWidth;
                const y = startY + row * cellHeight;

                // グリッドセルの透明なボタンを作成
                const zone = this.add.zone(x + cellWidth / 2, y + cellHeight / 2, cellWidth, cellHeight)
                    .setRectangleDropZone(cellWidth, cellHeight)
                    .setInteractive();

                zone.on('pointerdown', () => {
                    this.handleGridClick(row, col);
                });

                // グリッドセルの情報を保存
                this.grid.push({
                    row: row,
                    col: col,
                    x: x,
                    y: y,
                    width: cellWidth,
                    height: cellHeight,
                    number: null, // 後で数字を割り当て
                    object: null, // 数字のテキストオブジェクト
                    zone: zone // クリックエリアのゾーン
                });
            }
        }
    }

    placeNumbers() {
        const totalNumbers = this.level + 2; // 最初は3つ
        if (totalNumbers > this.gridSize * this.gridSize) {
            alert('すごくれべるがたかすぎるよ！ ゲームをおわるね。');
            this.scene.start('SelectionScene');
            return;
        }

        // 1からtotalNumbersまでの数字を生成
        this.numbers = [];
        for (let i = 1; i <= totalNumbers; i++) {
            this.numbers.push(i);
        }

        // 数字の配置場所をランダムに選択
        const availableIndices = Phaser.Utils.Array.NumberArray(0, this.grid.length - 1);
        Phaser.Utils.Array.Shuffle(availableIndices);

        this.numbers.forEach((num, index) => {
            const gridIndex = availableIndices[index];
            const cell = this.grid[gridIndex];
            cell.number = num;

            // 数字のテキストオブジェクトを作成
            const numberText = this.add.text(cell.x + cell.width / 2, cell.y + cell.height / 2, num, {
                fontSize: '48px',
                fill: '#fff',
                backgroundColor: '#FF5722',
                padding: { x: 20, y: 20 },
                borderRadius: 10
            }).setOrigin(0.5);
            cell.object = numberText;
        });
    }

    hideNumbers() {
        this.grid.forEach(cell => {
            if (cell.object) {
                cell.object.setVisible(false);
            }
        });
    }

    handleGridClick(row, col) {
        // クリックされたセルを特定
        const clickedCell = this.grid.find(cell => cell.row === row && cell.col === col);
        if (!clickedCell) return;

        // 既にクリック済みのセルを無視
        if (clickedCell.number === null) return;

        // 正しい数字をクリックしているか確認
        if (clickedCell.number === this.expectedNumber) {
            // 正しいクリック
            clickedCell.object.setVisible(true); // 数字を再表示
            clickedCell.object.setStyle({ backgroundColor: '#4CAF50' }); // 背景色を変更
            clickedCell.zone.disableInteractive(); // クリックを無効化

            this.expectedNumber += 1;

            // 最後の数字をクリックした場合
            if (this.expectedNumber > this.level + 2) {
                // 0.5秒待ってからクリア画面に遷移
                this.time.delayedCall(500, () => {
                    this.scene.start('ClearScene', { displayTime: this.displayTime, level: this.level });
                }, [], this);
            }
        } else {
            // 間違ったクリック
            this.scene.start('RetryScene', { displayTime: this.displayTime, level: this.level });
        }
    }
}

// シーン4: クリア画面
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
            this.time.delayedCall(100 * i, () => {
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
            }, [], this);
        }

        // 「つぎのれべる」ボタン
        const nextLevelButton = this.add.text(width / 2, height / 2 + 100, 'つぎのれべる', {
            fontSize: '48px',
            fill: '#fff',
            backgroundColor: '#4CAF50',
            padding: { x: 20, y: 10 },
            borderRadius: 10
        }).setOrigin(0.5).setInteractive();

        nextLevelButton.on('pointerdown', () => {
            this.scene.start('CountdownScene', { displayTime: this.displayTime, level: this.level + 1 });
        });
    }
}

// シーン5: リトライ画面（ゲームオーバー画面）
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
        this.add.text(width / 2, height / 3, 'がーむおーばー', {
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
            this.scene.start('SelectionScene');
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
    scene: [SelectionScene, CountdownScene, GameScene, ClearScene, RetryScene],
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

// ゲームインスタンスの作成
const game = new Phaser.Game(config);
