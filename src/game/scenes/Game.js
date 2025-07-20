import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor('#c2f9abff');

        // this.add.image(960, 540, 'background').setAlpha(0.5).setScale(2);
        const bg = this.add.image(0, 0, 'game').setOrigin(0, 0);

        this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight);

        this.input.on('pointermove', (pointer) => {

            if (pointer.isDown)
            {
                this.cameras.main.scrollX -= (pointer.x - pointer.prevPosition.x);
            }

        });

        
        const photoIcon = this.add.image(1450, 75, 'photo-icon').setScale(0.3);
        photoIcon.setScrollFactor(0);
        
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
    }
}
