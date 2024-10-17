handleGridClick(row, col) {
    // クリックされたセルを特定
    const clickedCell = this.grid.find(cell => cell.row === row && cell.col === col);
    if (!clickedCell) return;

    // 数字が表示されていないセルをクリックした場合もエラー
    if (clickedCell.number === null) {
        this.wrongCells.push({ row, col });
        this.scene.start('RetryScene', { 
            displayTime: this.displayTime, 
            level: this.level, 
            grid: this.grid, 
            wrongCells: this.wrongCells 
        });
        return;
    }

    // 既にクリック済みのセルを無視
    if (clickedCell.clicked) return;

    // 正しい数字をクリックしているか確認
    if (clickedCell.number === this.expectedNumber) {
        // 正しいクリック
        clickedCell.clicked = true; // 正しくクリックされたことを記録
        clickedCell.object.setVisible(true); // 数字を再表示
        clickedCell.object.setStyle({ backgroundColor: '#4CAF50' }); // 背景色を変更
        clickedCell.zone.disableInteractive(); // クリックを無効化

        // 視覚的な強調: 正しいクリック時にアニメーション
        this.tweens.add({
            targets: clickedCell.object,
            scale: { from: 1, to: 1.2 },
            yoyo: true,
            duration: 200
        });

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
        this.wrongCells.push({ row, col });
        // 視覚的な強調: 間違ったクリック時にエラーアニメーション
        this.tweens.add({
            targets: clickedCell.object,
            scale: { from: 1, to: 0.8 },
            yoyo: true,
            duration: 200
        });

        this.scene.start('RetryScene', { 
            displayTime: this.displayTime, 
            level: this.level, 
            grid: this.grid, 
            wrongCells: this.wrongCells 
        });
    }
}
