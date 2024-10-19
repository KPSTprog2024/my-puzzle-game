// 共通の定数やユーティリティ関数を定義
const COLORS = {
    primary: 0x2196F3,
    primaryHover: 0x1976D2,
    success: 0x4CAF50,
    successHover: 0x388E3C,
    danger: 0xFF5722,
    dangerHover: 0xD84315,
    info: 0x2196F3,
    infoHover: 0x1976D2,
    warning: 0xFFD700,
    selected: 0xFF9800,       // 選択されたボタンの色
    selectedHover: 0xFB8C00   // 選択されたボタンのホバー時の色
};

// フォントサイズとボタンサイズの調整関数
function calculateResponsiveSize(scene, baseSize) {
    const { width, height } = scene.scale;
    const minDimension = Math.min(width, height);
    return Math.max(Math.round(minDimension * baseSize), 12); // 最小フォントサイズを12pxに設定
}

// カスタムボタン作成関数
function createCustomButton(scene, text, x, y, width, height, backgroundColor, hoverColor, onClick) {
    const buttonContainer = scene.add.container(x, y);

    // ボタン背景をGraphicsで描画
    const buttonBackground = scene.add.graphics();
    buttonBackground.fillStyle(backgroundColor, 1);
    buttonBackground.fillRoundedRect(-width / 2, -height / 2, width, height, 10);

    // テキストを追加
    const fontSize = calculateResponsiveSize(scene, 0.02); // ベースのフォントサイズを調整
    const buttonText = scene.add.text(0, 0, text, {
        fontSize: `${fontSize}px`,
        fill: '#fff',
        align: 'center',
    }).setOrigin(0.5, 0.5);

    buttonContainer.add([buttonBackground, buttonText]);

    // インタラクティブ設定
    buttonContainer.setSize(width, height);
    buttonContainer.setInteractive({ useHandCursor: true });

    // デフォルトの色を保持
    buttonContainer.defaultColor = backgroundColor;
    buttonContainer.hoverColor = hoverColor;
    buttonContainer.selected = false;

    // ホバー時の処理
    buttonContainer.on('pointerover', () => {
        if (buttonContainer.selected) {
            buttonBackground.clear();
            buttonBackground.fillStyle(COLORS.selectedHover, 1);
            buttonBackground.fillRoundedRect(-width / 2, -height / 2, width, height, 10);
        } else {
            buttonBackground.clear();
            buttonBackground.fillStyle(buttonContainer.hoverColor, 1);
            buttonBackground.fillRoundedRect(-width / 2, -height / 2, width, height, 10);
        }
    });

    buttonContainer.on('pointerout', () => {
        if (buttonContainer.selected) {
            buttonBackground.clear();
            buttonBackground.fillStyle(COLORS.selected, 1);
            buttonBackground.fillRoundedRect(-width / 2, -height / 2, width, height, 10);
        } else {
            buttonBackground.clear();
            buttonBackground.fillStyle(buttonContainer.defaultColor, 1);
            buttonBackground.fillRoundedRect(-width / 2, -height / 2, width, height, 10);
        }
    });

    // クリック時の処理
    buttonContainer.on('pointerdown', () => {
        scene.tweens.add({
            targets: buttonContainer,
            scale: { from: 1, to: 0.95 },
            yoyo: true,
            duration: 100
        });
        onClick();
    });

    return buttonContainer;
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
        const titleFontSize = calculateResponsiveSize(this, 0.05);
        this.add.text(width / 2, height * 0.05, 'げーむせっていをえらんでね', {
            fontSize: `${titleFontSize}px`,
            fill: '#000',
            align: 'center',
            wordWrap: { width: width * 0.9 }
        }).setOrigin(0.5, 0.5);

        // ボタン設定
        const buttonWidth = width * 0.25;
        const buttonHeight = height * 0.07;
        const buttonSpacing = width * 0.02;

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
                buttonsArray: 'timeButtons',
                onSelect: (button, value) => {
                    this.selectedTime = value;
                    this.timeButtons.forEach(btn => {
                        btn.selected = false;
                        btn.emit('pointerout'); // 色を戻す
                    });
                    button.selected = true;
                    button.emit('pointerout'); // 色を更新
                    this.events.emit('selectionChanged');
                }
            },
            {
                title: 'ぐりっどさいずをえらんでね',
                yPosition: 0.3,
                items: [
                    { label: '3x3', value: 3 },
                    { label: '4x4', value: 4 },
                    { label: '5x5', value: 5 }
                ],
                buttonsArray: 'gridSizeButtons',
                onSelect: (button, value) => {
                    this.selectedGridSize = value;
                    this.gridSizeButtons.forEach(btn => {
                        btn.selected = false;
                        btn.emit('pointerout');
                    });
                    button.selected = true;
                    button.emit('pointerout');
                    this.events.emit('selectionChanged');
                }
            },
            {
                title: 'げーむもーどをえらんでね',
                yPosition: 0.45,
                items: [
                    { label: 'すうじもーど', value: 'number' },
                    { label: 'いろもーど', value: 'color' }
                ],
                buttonsArray: 'gameModeButtons',
                onSelect: (button, value) => {
                    this.selectedGameMode = value;
                    this.gameModeButtons.forEach(btn => {
                        btn.selected = false;
                        btn.emit('pointerout');
                    });
                    button.selected = true;
                    button.emit('pointerout');
                    this.events.emit('selectionChanged');
                }
            }
        ];

        // オプションごとにボタンを生成
        options.forEach(option => {
            // セクションタイトル
            const sectionFontSize = calculateResponsiveSize(this, 0.035);
            this.add.text(width / 2, height * option.yPosition, option.title, {
                fontSize: `${sectionFontSize}px`,
                fill: '#000',
                align: 'center',
                wordWrap: { width: width * 0.9 }
            }).setOrigin(0.5, 0.5);

            const totalWidth = option.items.length * buttonWidth + (option.items.length - 1) * buttonSpacing;
            let startX = (width - totalWidth) / 2 + buttonWidth / 2;
            const startY = height * (option.yPosition + 0.05);

            option.buttons = [];

            option.items.forEach((item, index) => {
                const button = createCustomButton(
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

        const startButton = createCustomButton(
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

// 他のシーンも必要に応じて修正しますが、ボタンが使われているのはSelectionSceneと結果画面なので、ここでは省略します。

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
    },
    // 解像度をデバイスのピクセル比に合わせる
    resolution: window.devicePixelRatio,
    pixelArt: true, // ピクセルアートモードを有効にすることで、ぼやけを軽減
};

// ゲームインスタンスの作成
const game = new Phaser.Game(config);

// ウィンドウリサイズ時の対応
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
