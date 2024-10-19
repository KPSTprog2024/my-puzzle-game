// シーン1: 表示時間選択画面と難易度・モード選択
class SelectionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SelectionScene' });
    }

    create() {
        const { width, height } = this.scale;

        // タイトル
        this.add.text(width / 2, height * 0.05, 'ゲーム設定を選んでね', {
            fontSize: `${height * 0.05}px`,
            fill: '#000',
            align: 'center',
            wordWrap: { width: width * 0.8 }
        }).setOrigin(0.5);

        // 表示時間選択セクション
        this.add.text(width / 2, height * 0.15, '表示時間を選んでね', {
            fontSize: `${height * 0.03}px`,
            fill: '#000',
            align: 'center',
            wordWrap: { width: width * 0.8 }
        }).setOrigin(0.5);

        const times = [
            { label: '0.5びょう', value: 500 },
            { label: '1びょう', value: 1000 },
            { label: '3びょう', value: 3000 }
        ];

        const buttonWidth = width * 0.25;
        const buttonHeight = height * 0.07;
        const buttonSpacing = width * 0.05;

        const totalTimeWidth = times.length * buttonWidth + (times.length - 1) * buttonSpacing;
        let timeStartX = (width - totalTimeWidth) / 2 + buttonWidth / 2;
        const timeStartY = height * 0.2;

        this.selectedTime = null;
        this.timeButtons = [];

        times.forEach((time, index) => {
            const button = this.add.text(timeStartX + index * (buttonWidth + buttonSpacing), timeStartY, time.label, {
                fontSize: `${height * 0.025}px`,
                fill: '#fff',
                backgroundColor: '#2196F3',
                padding: { x: 20, y: 10 },
                borderRadius: 10,
                align: 'center',
                wordWrap: { width: buttonWidth - 40 }
            })
                .setOrigin(0.5)
                .setInteractive()
                .setFixedSize(buttonWidth, buttonHeight)
                .setData('value', time.value)
                .setName(`timeButton_${index}`);

            // ホバー時のハイライト
            button.on('pointerover', () => {
                if (button !== this.selectedTimeButton) {
                    button.setStyle({ backgroundColor: '#1976D2' });
                }
            });

            button.on('pointerout', () => {
                if (button !== this.selectedTimeButton) {
                    button.setStyle({ backgroundColor: '#2196F3' });
                }
            });

            // ボタンクリック時のアニメーションと選択
            button.on('pointerdown', () => {
                this.tweens.add({
                    targets: button,
                    scale: { from: 1, to: 0.95 },
                    yoyo: true,
                    duration: 100
                });
                this.selectTime(button, time.value);
            });

            this.timeButtons.push(button);
        });

        // グリッドサイズ選択セクション
        this.add.text(width / 2, height * 0.3, 'グリッドサイズを選んでね', {
            fontSize: `${height * 0.03}px`,
            fill: '#000',
            align: 'center',
            wordWrap: { width: width * 0.8 }
        }).setOrigin(0.5);

        const gridSizes = [
            { label: '3x3', value: 3 },
            { label: '4x4', value: 4 },
            { label: '5x5', value: 5 }
        ];

        const totalGridWidth = gridSizes.length * buttonWidth + (gridSizes.length - 1) * buttonSpacing;
        let gridStartX = (width - totalGridWidth) / 2 + buttonWidth / 2;
        const gridStartY = height * 0.35;

        this.selectedGridSize = null;
        this.gridSizeButtons = [];

        gridSizes.forEach((size, index) => {
            const button = this.add.text(gridStartX + index * (buttonWidth + buttonSpacing), gridStartY, size.label, {
                fontSize: `${height * 0.025}px`,
                fill: '#fff',
                backgroundColor: '#2196F3',
                padding: { x: 20, y: 10 },
                borderRadius: 10,
                align: 'center',
                wordWrap: { width: buttonWidth - 40 }
            })
                .setOrigin(0.5)
                .setInteractive()
                .setFixedSize(buttonWidth, buttonHeight)
                .setData('value', size.value)
                .setName(`gridSizeButton_${index}`);

            // ホバー時のハイライト
            button.on('pointerover', () => {
                if (button !== this.selectedGridSizeButton) {
                    button.setStyle({ backgroundColor: '#1976D2' });
                }
            });

            button.on('pointerout', () => {
                if (button !== this.selectedGridSizeButton) {
                    button.setStyle({ backgroundColor: '#2196F3' });
                }
            });

            // ボタンクリック時のアニメーションと選択
            button.on('pointerdown', () => {
                this.tweens.add({
                    targets: button,
                    scale: { from: 1, to: 0.95 },
                    yoyo: true,
                    duration: 100
                });
                this.selectGridSize(button, size.value);
            });

            this.gridSizeButtons.push(button);
        });

        // ゲームモード選択セクション
        this.add.text(width / 2, height * 0.45, 'ゲームモードを選んでね', {
            fontSize: `${height * 0.03}px`,
            fill: '#000',
            align: 'center',
            wordWrap: { width: width * 0.8 }
        }).setOrigin(0.5);

        const gameModes = [
            { label: '数字モード', value: 'number' },
            { label: '色モード', value: 'color' }
        ];

        const totalModeWidth = gameModes.length * buttonWidth + (gameModes.length - 1) * buttonSpacing;
        let modeStartX = (width - totalModeWidth) / 2 + buttonWidth / 2;
        const modeStartY = height * 0.5;

        this.selectedGameMode = null;
        this.gameModeButtons = [];

        gameModes.forEach((mode, index) => {
            const button = this.add.text(modeStartX + index * (buttonWidth + buttonSpacing), modeStartY, mode.label, {
                fontSize: `${height * 0.025}px`,
                fill: '#fff',
                backgroundColor: '#2196F3',
                padding: { x: 20, y: 10 },
                borderRadius: 10,
                align: 'center',
                wordWrap: { width: buttonWidth - 40 }
            })
                .setOrigin(0.5)
                .setInteractive()
                .setFixedSize(buttonWidth, buttonHeight)
                .setData('value', mode.value)
                .setName(`gameModeButton_${index}`);

            // ホバー時のハイライト
            button.on('pointerover', () => {
                if (button !== this.selectedGameModeButton) {
                    button.setStyle({ backgroundColor: '#1976D2' });
                }
            });

            button.on('pointerout', () => {
                if (button !== this.selectedGameModeButton) {
                    button.setStyle({ backgroundColor: '#2196F3' });
                }
            });

            // ボタンクリック時のアニメーションと選択
            button.on('pointerdown', () => {
                this.tweens.add({
                    targets: button,
                    scale: { from: 1, to: 0.95 },
                    yoyo: true,
                    duration: 100
                });
                this.selectGameMode(button, mode.value);
            });

            this.gameModeButtons.push(button);
        });

        // スタートボタン
        const startButtonWidth = width * 0.3;
        const startButtonHeight = height * 0.07;

        const startButton = this.add.text(width / 2, height * 0.7, 'スタート', {
            fontSize: `${height * 0.035}px`,
            fill: '#fff',
            backgroundColor: '#4CAF50',
            padding: { x: 30, y: 15 },
            borderRadius: 10,
            align: 'center',
            wordWrap: { width: startButtonWidth - 40 }
        })
            .setOrigin(0.5)
            .setInteractive()
            .setFixedSize(startButtonWidth, startButtonHeight)
            .setAlpha(0.5) // 初期状態は無効
            .setData('enabled', false);

        // スタートボタンのスタイル更新関数
        const updateStartButton = () => {
            if (this.selectedTime && this.selectedGridSize && this.selectedGameMode) {
                startButton.setStyle({ backgroundColor: '#4CAF50' });
                startButton.setAlpha(1);
                startButton.setData('enabled', true);
            } else {
                startButton.setStyle({ backgroundColor: '#4CAF50' });
                startButton.setAlpha(0.5);
                startButton.setData('enabled', false);
            }
        };

        // スタートボタンのホバーとクリックイベント
        startButton.on('pointerover', () => {
            if (startButton.getData('enabled')) {
                startButton.setStyle({ backgroundColor: '#388E3C' });
            }
        });

        startButton.on('pointerout', () => {
            if (startButton.getData('enabled')) {
                startButton.setStyle({ backgroundColor: '#4CAF50' });
            }
        });

        startButton.on('pointerdown', () => {
            if (startButton.getData('enabled')) {
                this.tweens.add({
                    targets: startButton,
                    scale: { from: 1, to: 0.95 },
                    yoyo: true,
                    duration: 100
                });
                this.scene.start('CountdownScene', { 
                    displayTime: this.selectedTime, 
                    level: 1, 
                    gridSize: this.selectedGridSize, 
                    gameMode: this.selectedGameMode 
                });
            }
        });

        // リスナーを追加して選択時にスタートボタンを更新
        this.events.on('selectionChanged', updateStartButton, this);
    }

    // 選択された表示時間の処理
    SelectionScene.prototype.selectTime = function(button, value) {
        if (this.selectedTimeButton) {
            this.selectedTimeButton.setStyle({ backgroundColor: '#2196F3' });
        }
        this.selectedTime = value;
        this.selectedTimeButton = button;
        button.setStyle({ backgroundColor: '#4CAF50' });
        this.events.emit('selectionChanged');
    };

    // 選択されたグリッドサイズの処理
    SelectionScene.prototype.selectGridSize = function(button, value) {
        if (this.selectedGridSizeButton) {
            this.selectedGridSizeButton.setStyle({ backgroundColor: '#2196F3' });
        }
        this.selectedGridSize = value;
        this.selectedGridSizeButton = button;
        button.setStyle({ backgroundColor: '#4CAF50' });
        this.events.emit('selectionChanged');
    };

    // 選択されたゲームモードの処理
    SelectionScene.prototype.selectGameMode = function(button, value) {
        if (this.selectedGameModeButton) {
            this.selectedGameModeButton.setStyle({ backgroundColor: '#2196F3' });
        }
        this.selectedGameMode = value;
        this.selectedGameModeButton = button;
        button.setStyle({ backgroundColor: '#4CAF50' });
        this.events.emit('selectionChanged');
    };

// シーン2: カウントダウン
class CountdownScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CountdownScene' });
    }

    init(data) {
        this.displayTime = data.displayTime;
        this.level = data.level;
        this.gridSize = data.gridSize;
        this.gameMode = data.gameMode;
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
}

// シーン3: ゲームプレイ画面
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        this.displayTime = data.displayTime;
        this.level = data.level;
        this.gridSize = data.gridSize;
        this.gameMode = data.gameMode;
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
        this.add.text(width * 0.05, height * 0.05, `レベル: ${this.level}`, {
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

        // グリッドセルのクリックエリアを設定
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const x = startX + col * cellWidth;
                const y = startY + row * cellHeight;

                // グリッドセルの透明なボタンを作成
                const zone = this.add.zone(x + cellWidth / 2, y + cellHeight / 2, cellWidth, cellHeight)
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

    placeNumbers() {
        const totalNumbers = this.level + 2;
        if (totalNumbers > this.gridSize * this.gridSize) {
            alert('レベルが高すぎます！ ゲームを終了します。');
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
                backgroundColor: '#FF5722',
                padding: { x: 10, y: 10 },
                borderRadius: 5,
                align: 'center',
                wordWrap: { width: cell.width * 0.8 }
            }).setOrigin(0.5);
            cell.object = numberText;
        });
    }

    placeColors() {
        const totalColors = this.level + 2;
        if (totalColors > this.gridSize * this.gridSize) {
            alert('レベルが高すぎます！ ゲームを終了します。');
            this.scene.start('SelectionScene');
            return;
        }

        // 色のリスト
        const colors = [
            0xff5733, // 赤
            0x33ff57, // 緑
            0x3357ff, // 青
            0xff33a8, // ピンク
            0xfff933, // 黄色
            0x33fff5, // 水色
            0x8e44ad, // 紫
            0xe67e22, // オレンジ
            0x2ecc71, // ライム
            0x3498db  // 明るい青
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

            // 色ブロックのオブジェクトを作成
            const colorBlock = this.add.rectangle(cell.x, cell.y, cell.width * 0.8, cell.height * 0.8, color)
                .setOrigin(0.5)
                .setInteractive();
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
                clickedCell.object.setVisible(true);
                clickedCell.object.setStyle({ backgroundColor: '#4CAF50' });
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

            // クリックされた色ブロックを記録
            clickedCell.clicked = true;
            clickedCell.object.setAlpha(1);
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
}

// シーン4: クリア画面
class ClearScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ClearScene' });
    }

    init(data) {
        this.displayTime = data.displayTime;
        this.level = data.level;
        this.gridSize = data.gridSize;
        this.gameMode = data.gameMode;
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
            fill: '#FFD700',
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
        const nextLevelButton = this.add.text(width / 2, height * 0.65, 'つぎのれべる', {
            fontSize: `${height * 0.035}px`,
            fill: '#fff',
            backgroundColor: '#4CAF50',
            padding: { x: 20, y: 10 },
            borderRadius: 10,
            align: 'center',
            wordWrap: { width: width * 0.3 }
        }).setOrigin(0.5).setInteractive();

        // ホバー時のハイライト
        nextLevelButton.on('pointerover', () => {
            nextLevelButton.setStyle({ backgroundColor: '#388E3C' });
        });

        nextLevelButton.on('pointerout', () => {
            nextLevelButton.setStyle({ backgroundColor: '#4CAF50' });
        });

        // ボタンクリック時のアニメーション
        nextLevelButton.on('pointerdown', () => {
            this.tweens.add({
                targets: nextLevelButton,
                scale: { from: 1, to: 0.95 },
                yoyo: true,
                duration: 100
            });

            this.scene.start('CountdownScene', { 
                displayTime: this.displayTime, 
                level: this.level + 1, 
                gridSize: this.gridSize, 
                gameMode: this.gameMode 
            });
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
        this.gridSize = data.gridSize;
        this.gameMode = data.gameMode;
        this.grid = data.grid;
        this.wrongCells = data.wrongCells;
    }

    create() {
        const { width, height } = this.scale;

        // ゲームオーバーのテキスト
        this.add.text(width / 2, height * 0.3, 'がーむおーばー', {
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
                    backgroundColor: '#FF5722',
                    padding: { x: 10, y: 10 },
                    borderRadius: 5,
                    align: 'center',
                    wordWrap: { width: cell.width * 0.8 }
                }).setOrigin(0.5);
            } else if (this.gameMode === 'color' && cell.color !== null) {
                const colorBlock = this.add.rectangle(cell.x, cell.y, cell.width * 0.8, cell.height * 0.8, cell.color)
                    .setOrigin(0.5)
                    .setAlpha(1);
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

        // 「もういちど」ボタン
        const retryButton = this.add.text(width / 2, height * 0.65, 'もういちど', {
            fontSize: `${height * 0.035}px`,
            fill: '#fff',
            backgroundColor: '#FF5722',
            padding: { x: 20, y: 10 },
            borderRadius: 10,
            align: 'center',
            wordWrap: { width: width * 0.3 }
        }).setOrigin(0.5).setInteractive();

        // ホバー時のハイライト
        retryButton.on('pointerover', () => {
            retryButton.setStyle({ backgroundColor: '#D84315' });
        });

        retryButton.on('pointerout', () => {
            retryButton.setStyle({ backgroundColor: '#FF5722' });
        });

        // ボタンクリック時のアニメーション
        retryButton.on('pointerdown', () => {
            this.tweens.add({
                targets: retryButton,
                scale: { from: 1, to: 0.95 },
                yoyo: true,
                duration: 100
            });

            this.scene.start('GameScene', { 
                displayTime: this.displayTime, 
                level: this.level, 
                gridSize: this.gridSize, 
                gameMode: this.gameMode 
            });
        });

        // 「さいしょから」ボタン
        const restartButton = this.add.text(width / 2, height * 0.8, 'さいしょから', {
            fontSize: `${height * 0.035}px`,
            fill: '#fff',
            backgroundColor: '#2196F3',
            padding: { x: 20, y: 10 },
            borderRadius: 10,
            align: 'center',
            wordWrap: { width: width * 0.3 }
        }).setOrigin(0.5).setInteractive();

        // ホバー時のハイライト
        restartButton.on('pointerover', () => {
            restartButton.setStyle({ backgroundColor: '#1976D2' });
        });

        restartButton.on('pointerout', () => {
            restartButton.setStyle({ backgroundColor: '#2196F3' });
        });

        // ボタンクリック時のアニメーション
        restartButton.on('pointerdown', () => {
            this.tweens.add({
                targets: restartButton,
                scale: { from: 1, to: 0.95 },
                yoyo: true,
                duration: 100
            });

            this.scene.start('SelectionScene');
        });
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
