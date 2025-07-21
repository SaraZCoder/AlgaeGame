import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.photoIsVisible = false;
        this.cameras.main.setBackgroundColor('#c2f9abff');

        const bg = this.add.image(0, 0, 'game-bg').setOrigin(0, 0);

        this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight);

        this.input.on('pointermove', (pointer) => {

            if (pointer.isDown && !this.photoIsVisible)
            {
                this.cameras.main.scrollX -= (pointer.x - pointer.prevPosition.x);
            }

        });
        
        const photoIcon = this.add.image(1450, 75, 'photo-icon-dark').setScale(0.3);
        photoIcon.setScrollFactor(0);
        const score = this.add.text(1418, 50, '0/6', 
            { font: '48px Arial', fill: '#ffffffff' }
        );
        score.setScrollFactor(0);
        
        const message = this.add.text(1296, 200, '', { font: '48px Arial', fill: '#000000' }).setOrigin(0.5);
        const fishTank = this.add.image(0, 0, 'fish-tank').setOrigin(0, 0).setInteractive({ pixelPerfect: true });
        const fertilizer = this.add.image(0, 0, 'fertilizer').setOrigin(0, 0).setInteractive({ pixelPerfect: true });
        const food = this.add.image(0, 0, 'food').setOrigin(0, 0).setInteractive({ pixelPerfect: true });
        const lotion = this.add.image(0, 0, 'lotion').setOrigin(0, 0).setInteractive({ pixelPerfect: true });
        const petFood = this.add.image(0, 0, 'pet-food').setOrigin(0, 0).setInteractive({ pixelPerfect: true });
        const oil = this.add.image(0, 0, 'oil').setOrigin(0, 0).setInteractive({ pixelPerfect: true });

        fertilizer.on('pointerdown', () => {
            if (message.text) {
                message.setText('');
            } else {
                message.setText('Fertilizer clicked!');
            }
        });
        
        food.on('pointerdown', () => {
            if (message.text) {
                message.setText('');
            } else {
                message.setText('Food clicked!');
            }
        });

        fishTank.on('pointerdown', () => {
            if (message.text) {
                message.setText('');
            } else {
                message.setText('Fish tank clicked!');
            }
        });

        lotion.on('pointerdown', () => {
            if (message.text) {
                message.setText('');
            } else {
                message.setText('Lotion clicked!');
            }
        });

        petFood.on('pointerdown', () => {
            if (message.text) {
                message.setText('');
            } else {
                message.setText('Pet food clicked!');
            }
        });

        oil.on('pointerdown', () => {
            if (message.text) {
                message.setText('');
            } else {
                message.setText('Oil clicked!');
            }
        });

        const textPages = [
            "This is a very long text that is supposed to be longer than the box, so we have to paginate it.",
            "The user will click to see the next part of the text. This is the second part.",
            "And this is the final part. Click one more time to close this view."
        ];

        photoIcon.setInteractive().on('pointerdown', () => {
            this.showPhoto(textPages);
        });
    }

    showPhoto (textPages)
    {
        this.photoIsVisible = true;

        const bg = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.5).setAlpha(0);
        bg.setScrollFactor(0).setInteractive();

        const photo = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'animation-photo').setAlpha(0);
        photo.setScrollFactor(0).setInteractive({ pixelPerfect: true });
        
        const text = this.add.text(photo.x, photo.y + 200, '', { font: '32px Arial', fill: '#000000', wordWrap: { width: 800 }, align: 'left' }).setOrigin(0.5);
        text.setScrollFactor(0).setAlpha(0);

        this.tweens.add({
            targets: [bg, photo, text],
            alpha: 1,
            duration: 500,
            onComplete: () => {
                let currentPage = 0;
                text.setText(textPages[currentPage]);

                photo.on('pointerdown', () => {
                    currentPage++;
                    if (currentPage < textPages.length) {
                        this.tweens.add({
                            targets: text,
                            alpha: 0,
                            duration: 250,
                            yoyo: true,
                            onYoyo: () => {
                                text.setText(textPages[currentPage]);
                            }
                        });
                    } else {
                        this.tweens.add({
                            targets: [bg, photo, text],
                            alpha: 0,
                            duration: 500,
                            onComplete: () => {
                                bg.destroy();
                                photo.destroy();
                                text.destroy();
                                this.photoIsVisible = false;
                            }
                        });
                    }
                });
            }
        });
    }
}
