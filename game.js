// 共通の定数やユーティリティ関数を定義
const COLORS = {
    primary: '#2196F3',
    primaryHover: '#1976D2',
    success: '#4CAF50',
    successHover: '#388E3C',
    danger: '#FF5722',
    dangerHover: '#D84315',
    info: '#2196F3',
    infoHover: '#1976D2',
    warning: '#FFD700'
};

function createButton(scene, text, x, y, width, height, backgroundColor, hoverColor, onClick) {
    const button = scene.add.text(x, y, text, {
        fontSize: `${height * 0.5}px`,
        fill: '#fff',
        backgroundColor: backgroundColor,
        padding: { x: 20, y: 10 },
        borderRadius: 10,
        align: 'center',
        wordWrap: { width: width - 40 }
    })
        .setOrigin(0.5)
        .setInteractive()
        .setFixedSize(width, height);

    button.on('pointerover', () => {
        button.setStyle({ backgroundColor: hoverColor });
    });

    button.on('pointerout', () => {
        button.setStyle({ backgroundColor: backgroundColor });
    });

    button.on('pointerdown', () => {
        scene.tweens.add({
            targets: button,
            scale: { from: 1, to: 0.95 },
            yoyo: true,
            duration: 100
        });
        onClick();
    });

    return button;
}

// ベースとなるシーンクラス
class BaseScene extends Phaser.Scene {
    constructor(key) {
        super({ key: key });
    }

    init(data) {
        this.displayTime = data.displayTime || 1000;
        this.level = data.level || 1;
        this.gridSize = data.gridSize || 3;
        this.gameMode = data.gameMode || 'number';
    }

    drawGrid() {
        const { width, height } = this.scale;
        const gridWidth = width * 0.8;
        const gridHeight = height * 0.8;
        const startX = (width - gridWidth) / 2;
        const startY = (height - gridHeight) / 2;
        const gridSize = this.gridSize;
        const cellWidth = gridWidth / gridSize;
        const cellHeight = gridHeight / gridSize;

        // グリッドの線を描画
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0x000000, 1);

        // 縦線
        for (let i = 0; i <= gridSize; i++) {
            graphics.moveTo(startX + i * cellWidth, startY);
            graphics.lineTo(startX + i * cellWidth, startY + gridHeight);
        }

        // 横線
        for (let i = 0; i <= gridSize; i++) {
            graphics.moveTo(startX, startY + i * cellHeight);
            graphics.lineTo(startX + gridWidth, startY + i * cellHeight);
        }

        graphics.strokePath();
    }

    createParticleEffect() {
        const { width, height } = this.scale;
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
    }
}

// シーン1: SelectionScene
class SelectionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SelectionScene' });
    }

    create() {
        const { width, height } = this.scale;

        // タイトル
        this.add.text(width / 2, height * 0.05, 'げーむせっていをえらんでね', {
            fontSize: `${height * 0.05}px`,
            fill: '#000',
            align: 'center',
            wordWrap: { width: width * 0.8 }
        }).setOrigin(0.5);

        // ボタン設定
        const buttonWidth = width * 0.25;
        const buttonHeight = height * 0.07;
        const buttonSpacing = width * 0.05;

        // 選択オプション
        const options = [
            {
                title: 'ひょうじじかんをえらんでね',
                yPosition: 0.15,
                items: [
                    { label: '0.5びょう', value: 500 },
                    { label: '1びょう', value: 1000 },
                    { label: '3びょう', value: 3000 }
                ],
                selectedValue: null,
                selectedButton: null,
                buttons: [],
                onSelect: (button, value) => {
                    this.selectedTime = value;
                    this.timeButtons.forEach(btn => {
                        btn.setStyle({ backgroundColor: COLORS.primary });
                    });
                    button.setStyle({ backgroundColor: COLORS.success });
                    this.events.emit('selectionChanged');
                },
                buttonsArray: 'timeButtons'
            },
            {
                title: 'ぐりっどさいずをえらんでね',
                yPosition: 0.3,
                items: [
                    { label: '3x3', value: 3 },
                    { label: '4x4', value: 4 },
                    { label: '5x5', value: 5 }
                ],
                selectedValue: null,
                selectedButton: null,
                buttons: [],
                onSelect: (button, value) => {
                    this.selectedGridSize = value;
                    this.gridSizeButtons.forEach(btn => {
                        btn.setStyle({ backgroundColor: COLORS.primary });
                    });
                    button.setStyle({ backgroundColor: COLORS.success });
                    this.events.emit('selectionChanged');
                },
                buttonsArray: 'gridSizeButtons'
            },
            {
                title: 'げーむもーどをえらんでね',
                yPosition: 0.45,
                items: [
                    { label: 'すうじもーど', value: 'number' },
                    { label: 'いろもーど', value: 'color' }
                ],
                selectedValue: null,
                selectedButton: null,
                buttons: [],
                onSelect: (button, value) => {
                    this.selectedGameMode = value;
                    this.gameModeButtons.forEach(btn => {
                        btn.setStyle({ backgroundColor: COLORS.primary });
                    });
                    button.setStyle({ backgroundColor: COLORS.success });
                    this.events.emit('selectionChanged');
                },
                buttonsArray: 'gameModeButtons'
            }
        ];

        // オプションごとにボタンを生成
        options.forEach(option => {
            // セクションタイトル
            this.add.text(width / 2, height * option.yPosition, option.title, {
                fontSize: `${height * 0.03}px`,
                fill: '#000',
                align: 'center',
                wordWrap: { width: width * 0.8 }
            }).setOrigin(0.5);

            const totalWidth = option.items.length * buttonWidth + (option.items.length - 1) * buttonSpacing;
            let startX = (width - totalWidth) / 2 + buttonWidth / 2;
            const startY = height * (option.yPosition + 0.05);

            option.buttons = [];

            option.items.forEach((item, index) => {
                const button = createButton(
                    this,
                    item.label,
                    startX + index * (buttonWidth + buttonSpacing),
                    startY,
                    buttonWidth,
                    buttonHeight,
                    COLORS.primary,
                    COLORS.primaryHover,
                    () => option.onSelect(button, item.value)
                );

                option.buttons.push(button);
            });

            this[option.buttonsArray] = option.buttons;
        });

        // スタートボタン
        const startButtonWidth = width * 0.3;
        const startButtonHeight = height * 0.07;

        const startButton = createButton(
            this,
            'スタート',
            width / 2,
            height * 0.7,
            startButtonWidth,
            startButtonHeight,
            COLORS.success,
            COLORS.successHover,
            () => {
                if (startButton.getData('enabled')) {
                    this.scene.start('CountdownScene', {
                        displayTime: this.selectedTime,
                        level: 1,
                        gridSize: this.selectedGridSize,
                        gameMode: this.selectedGameMode
                    });
                }
            }
        );

        startButton.setAlpha(0.5); // 初期状態は無効
        startButton.setData('enabled', false);

        // スタートボタンのスタイル更新関数
        const updateStartButton = () => {
            if (this.selectedTime && this.selectedGridSize && this.selectedGameMode) {
                startButton.setAlpha(1);
                startButton.setData('enabled', true);
            } else {
                startButton.setAlpha(0.5);
                startButton.setData('enabled', false);
            }
        };

        // リスナーを追加して選択時にスタートボタンを更新
        this.events.on('selectionChanged', updateStartButton, this);
    }
}

// シーン2: CountdownScene
class CountdownScene extends BaseScene {
    constructor() {
        super('CountdownScene');
    }

    create() {
        const { width, height } = this.scale;
        this.count = 3;

        // カウントダウン用グリッド
        this.drawGrid();

        // カウントダウン数字
        this.countText = this.add.text(width / 2, height / 2, this.count, {
            fontSize: `${height * 0.1}px`,
            fill: '#FF0000',
            align: 'center'
        }).setOrigin(0.5);

        // カウントダウン数字にアニメーションを追加
        this.tweens.add({
            targets: this.countText,
            scale: { from: 1, to: 1.5 },
            yoyo: true,
            repeat: -1,
            duration: 500
        });

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
            // カウントダウン終了時にアニメーションを停止
            this.tweens.killTweensOf(this.countText);
            this.countText.destroy();
            this.scene.start('GameScene', {
                displayTime: this.displayTime,
                level: this.level,
                gridSize: this.gridSize,
                gameMode: this.gameMode
            });
        }
    }
}

// シーン3: GameScene
class GameScene extends BaseScene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        super.init(data);
        this.expectedNumber = 1;
        this.numbers = [];
        this.grid = [];
        this.wrongCells = [];
        this.totalTargets = 0;
        this.clickedTargets = 0;
    }

    create() {
        const { width, height } = this.scale;

        // レベル表示
        this.add.text(width * 0.05, height * 0.05, `れべる: ${this.level}`, {
            fontSize: `${height * 0.025}px`,
            fill: '#000'
        }).setOrigin(0, 0);

        // グリッドの描画
        this.drawGrid();

        // 数字または色の配置
        if (this.gameMode === 'number') {
            this.placeNumbers();
        } else if (this.gameMode === 'color') {
            this.placeColors();
        }

        // 一定時間後に表示を隠す
        this.time.delayedCall(this.displayTime, () => {
            this.hideElements();
        }, [], this);
    }

    placeNumbers() {
        const totalNumbers = this.level + 2;
        if (totalNumbers > this.gridSize * this.gridSize) {
            alert('れべるがたかすぎます！ げーむをしゅうりょうします。');
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
            const numberText = this.add.text(cell.x, cell.y, num, {
                fontSize: `${cell.height * 0.3}px`,
                fill: '#fff',
                backgroundColor: COLORS.danger,
                padding: { x: 10, y: 10 },
                borderRadius: 5,
                align: 'center',
                wordWrap: { width: cell.width * 0.8 }
            }).setOrigin(0.5).setVisible(true); // 初期は表示

            cell.object = numberText;
        });
    }

    placeColors() {
        const totalColors = this.level + 2;
        if (totalColors > this.gridSize * this.gridSize) {
            alert('れべるがたかすぎます！ げーむをしゅうりょうします。');
            this.scene.start('SelectionScene');
            return;
        }

        // 色のリスト
        const colors = [
            0xff5733, // あか
            0x33ff57, // みどり
            0x3357ff, // あお
            0xff33a8, // ピンク
            0xfff933, // きいろ
            0x33fff5, // みずいろ
            0x8e44ad, // むらさき
            0xe67e22, // オレンジ
            0x2ecc71, // ライム
            0x3498db  // あかるいあお
        ];

        // 色の選択
        const selectedColors = Phaser.Utils.Array.Shuffle(colors).slice(0, totalColors);

        // 色の配置場所をランダムに選択
        const availableIndices = Phaser.Utils.Array.NumberArray(0, this.grid.length - 1);
        Phaser.Utils.Array.Shuffle(availableIndices);

        selectedColors.forEach((color, index) => {
            const gridIndex = availableIndices[index];
            const cell = this.grid[gridIndex];
            cell.color = color;

            // 色ブロックのオブジェクトを作成（初期は非表示）
            const colorBlock = this.add.rectangle(cell.x, cell.y, cell.width * 0.8, cell.height * 0.8, color)
                .setOrigin(0.5)
                .setInteractive()
                .setAlpha(0); // 初期は非表示
            cell.object = colorBlock;
        });

        this.totalTargets = selectedColors.length;
    }

    hideElements() {
        this.grid.forEach(cell => {
            if (cell.object) {
                cell.object.setVisible(false);
            }
        });
    }

    handleGridClick(row, col) {
        const clickedCell = this.grid.find(cell => cell.row === row && cell.col === col);
        if (!clickedCell) return;

        if (this.gameMode === 'number') {
            // 数字モード
            if (clickedCell.number === null) {
                this.wrongCells.push({ row, col });
                this.scene.start('RetryScene', {
                    displayTime: this.displayTime,
                    level: this.level,
                    gridSize: this.gridSize,
                    gameMode: this.gameMode,
                    grid: this.grid,
                    wrongCells: this.wrongCells
                });
                return;
            }

            if (clickedCell.clicked) return;

            if (clickedCell.number === this.expectedNumber) {
                clickedCell.clicked = true;
                clickedCell.object.setStyle({ backgroundColor: COLORS.success });
                clickedCell.object.setVisible(true);
                clickedCell.zone.disableInteractive();

                this.tweens.add({
                    targets: clickedCell.object,
                    scale: { from: 1, to: 1.2 },
                    yoyo: true,
                    duration: 200
                });

                this.expectedNumber += 1;

                if (this.expectedNumber > this.numbers.length) {
                    this.time.delayedCall(500, () => {
                        this.scene.start('ClearScene', {
                            displayTime: this.displayTime,
                            level: this.level,
                            gridSize: this.gridSize,
                            gameMode: this.gameMode
                        });
                    }, [], this);
                }
            } else {
                this.wrongCells.push({ row, col });
                if (clickedCell.object) {
                    this.tweens.add({
                        targets: clickedCell.object,
                        scale: { from: 1, to: 0.8 },
                        yoyo: true,
                        duration: 200
                    });
                }

                this.scene.start('RetryScene', {
                    displayTime: this.displayTime,
                    level: this.level,
                    gridSize: this.gridSize,
                    gameMode: this.gameMode,
                    grid: this.grid,
                    wrongCells: this.wrongCells
                });
            }
        } else if (this.gameMode === 'color') {
            // 色モード
            if (clickedCell.color === null) {
                this.wrongCells.push({ row, col });
                this.scene.start('RetryScene', {
                    displayTime: this.displayTime,
                    level: this.level,
                    gridSize: this.gridSize,
                    gameMode: this.gameMode,
                    grid: this.grid,
                    wrongCells: this.wrongCells
                });
                return;
            }

            if (clickedCell.clicked) return;

            // 色モードではタッチが正しい場合に色ブロックを表示
            clickedCell.clicked = true;
            clickedCell.object.setAlpha(1); // 表示
            clickedCell.zone.disableInteractive();

            this.tweens.add({
                targets: clickedCell.object,
                scale: { from: 1, to: 1.2 },
                yoyo: true,
                duration: 200
            });

            this.clickedTargets += 1;

            if (this.clickedTargets >= this.totalTargets) {
                this.time.delayedCall(500, () => {
                    this.scene.start('ClearScene', {
                        displayTime: this.displayTime,
                        level: this.level,
                        gridSize: this.gridSize,
                        gameMode: this.gameMode
                    });
                }, [], this);
            }
        }
    }

    drawGrid() {
        super.drawGrid();
        const { width, height } = this.scale;
        const gridWidth = width * 0.8;
        const gridHeight = height * 0.8;
        const startX = (width - gridWidth) / 2;
        const startY = (height - gridHeight) / 2;
        const gridSize = this.gridSize;
        const cellWidth = gridWidth / gridSize;
        const cellHeight = gridHeight / gridSize;

        // グリッドセルのクリックエリアを設定
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const x = startX + col * cellWidth + cellWidth / 2;
                const y = startY + row * cellHeight + cellHeight / 2;

                // グリッドセルの透明なボタンを作成
                const zone = this.add.zone(x, y, cellWidth, cellHeight)
                    .setRectangleDropZone(cellWidth, cellHeight)
                    .setInteractive();

                // ホバー時のハイライト
                zone.on('pointerover', () => {
                    zone.setAlpha(0.3);
                });

                zone.on('pointerout', () => {
                    zone.setAlpha(0);
                });

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
                    color: null,  // 後で色を割り当て
                    object: null, // テキストまたは色ブロックのオブジェクト
                    zone: zone,
                    clicked: false
                });
            }
        }
    }
}

// シーン4: ClearScene
class ClearScene extends BaseScene {
    constructor() {
        super('ClearScene');
    }

    init(data) {
        super.init(data);
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
        this.add.text(width / 2, height * 0.3, 'クリア！', {
            fontSize: `${height * 0.05}px`,
            fill: COLORS.warning,
            align: 'center',
            wordWrap: { width: width * 0.8 }
        }).setOrigin(0.5);

        // ランダムメッセージ
        const randomMessage = Phaser.Utils.Array.GetRandom(this.messages);
        this.add.text(width / 2, height / 2, randomMessage, {
            fontSize: `${height * 0.035}px`,
            fill: '#000',
            align: 'center',
            wordWrap: { width: width * 0.8 }
        }).setOrigin(0.5);

        // エフェクト（簡易的な花火）
        this.createParticleEffect();

        // 「つぎのれべる」ボタン
        const nextLevelButton = createButton(
            this,
            'つぎのれべる',
            width / 2,
            height * 0.65,
            width * 0.3,
            height * 0.07,
            COLORS.success,
            COLORS.successHover,
            () => {
                this.scene.start('CountdownScene', {
                    displayTime: this.displayTime,
                    level: this.level + 1,
                    gridSize: this.gridSize,
                    gameMode: this.gameMode
                });
            }
        );
    }
}

// シーン5: RetryScene
class RetryScene extends BaseScene {
    constructor() {
        super('RetryScene');
    }

    init(data) {
        super.init(data);
        this.grid = data.grid;
        this.wrongCells = data.wrongCells;
    }

    create() {
        const { width, height } = this.scale;

        // ゲームオーバーのテキスト
        this.add.text(width / 2, height * 0.3, 'ゲームオーバー', {
            fontSize: `${height * 0.05}px`,
            fill: '#FF0000',
            align: 'center',
            wordWrap: { width: width * 0.8 }
        }).setOrigin(0.5);

        // グリッドの描画
        this.drawGrid();

        // 正しい数字または色を全て表示
        this.grid.forEach(cell => {
            if (this.gameMode === 'number' && cell.number !== null) {
                const numberText = this.add.text(cell.x, cell.y, cell.number, {
                    fontSize: `${cell.height * 0.3}px`,
                    fill: '#fff',
                    backgroundColor: COLORS.danger,
                    padding: { x: 10, y: 10 },
                    borderRadius: 5,
                    align: 'center',
                    wordWrap: { width: cell.width * 0.8 }
                }).setOrigin(0.5).setVisible(true); // 正しい数字を表示
            } else if (this.gameMode === 'color' && cell.color !== null) {
                const colorBlock = this.add.rectangle(cell.x, cell.y, cell.width * 0.8, cell.height * 0.8, cell.color)
                    .setOrigin(0.5)
                    .setAlpha(1); // 正しい色ブロックを表示
            }
        });

        // 間違ってクリックされたセルに「×」マークを表示
        this.wrongCells.forEach(wrongCell => {
            const cell = this.grid.find(c => c.row === wrongCell.row && c.col === wrongCell.col);
            if (cell) {
                this.add.text(cell.x, cell.y, '×', {
                    fontSize: `${height * 0.05}px`,
                    fill: '#FF0000',
                    align: 'center'
                }).setOrigin(0.5);
            }
        });

        // エフェクト（簡易的な花火）
        this.createParticleEffect();

        // 「もういちど」ボタン
        const retryButton = createButton(
            this,
            'もういちど',
            width / 2,
            height * 0.65,
            width * 0.3,
            height * 0.07,
            COLORS.danger,
            COLORS.dangerHover,
            () => {
                this.scene.start('CountdownScene', {
                    displayTime: this.displayTime,
                    level: this.level,
                    gridSize: this.gridSize,
                    gameMode: this.gameMode
                });
            }
        );

        // 「さいしょから」ボタン
        const restartButton = createButton(
            this,
            'さいしょから',
            width / 2,
            height * 0.8,
            width * 0.3,
            height * 0.07,
            COLORS.info,
            COLORS.infoHover,
            () => {
                this.scene.start('SelectionScene');
            }
        );
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
