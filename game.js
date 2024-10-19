// ボタンを横に並べる
const totalWidth = option.items.length * buttonWidth + (option.items.length - 1) * buttonSpacing;
let startX = (width - totalWidth) / 2 + buttonWidth / 2;
const startY = height * (option.yPosition + 0.08);

option.buttons = [];

option.items.forEach((item, index) => {
    const buttonX = startX + index * (buttonWidth + buttonSpacing);
    const button = createCustomButton(
        this,
        item.label,
        buttonX,
        startY,
        buttonWidth,
        buttonHeight,
        COLORS.primary,
        COLORS.primaryHover,
        () => option.onSelect(button, item.value)
    );

    option.buttons.push(button);
});
