import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        const gameWidth = this.registry.get('gameWidth');
        const gameHeight = this.registry.get('gameHeight');
        this.intro = ['Welcome to the wonderful world of algae!', 'Let\'s see what we can make!'];
        this.outro = ['Goodbye!', 'Let\'s see what you can make with this knowledge!'];
        
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
        
        // Handle score logic and display with photo icon
        this.score = 0
        const photoIcon = this.add.image(1450, 75, 'photo-icon-dark').setScale(0.3);
        photoIcon.setScrollFactor(0);
        this.scoreMessage = this.add.text(1418, 50, '0/6', 
            { font: '48px Arial', fill: '#ffffffff' }
        );
        this.scoreMessage.setScrollFactor(0);
        
        // Declare interactive elements
        const fishTank = this.add.image(0, 0, 'fish-tank').setOrigin(0, 0).setInteractive({ pixelPerfect: true });
        const fertilizer = this.add.image(0, 0, 'fertilizer').setOrigin(0, 0).setInteractive({ pixelPerfect: true });
        const food = this.add.image(0, 0, 'food').setOrigin(0, 0).setInteractive({ pixelPerfect: true });
        const lotion = this.add.image(0, 0, 'lotion').setOrigin(0, 0).setInteractive({ pixelPerfect: true });
        const petFood = this.add.image(0, 0, 'pet-food').setOrigin(0, 0).setInteractive({ pixelPerfect: true });
        const oil = this.add.image(0, 0, 'oil').setOrigin(0, 0).setInteractive({ pixelPerfect: true });

        // Handle interactions
        oil.on('pointerdown', () => {
            this.showPhoto('algae-oil', ['Dummy text for oil.']);
            oil.removeInteractive();
        });
        food.on('pointerdown', () => {
            this.showPhoto('algae-food', ['Dummy text for food.']);
            oil.removeInteractive();
        });
        petFood.on('pointerdown', () => {
            this.showPhoto('algae-pet-food', ['Dummy text for pet food.']);
            oil.removeInteractive();
        });
        fishTank.on('pointerdown', () => {
            this.showPhoto('algae-fish-tank', ['Dummy text for fish tank.']);
            oil.removeInteractive();
        });
        lotion.on('pointerdown', () => {
            this.showPhoto('algae-lotion', ['Dummy text for lotion.']);
            oil.removeInteractive();
        });
        fertilizer.on('pointerdown', () => {
            this.showPhoto('algae-fertilizer', ['Dummy text for fertilizer.', 'MORE!!!', 'MOROEEEEEOOE!']);
            oil.removeInteractive();
        });

        const textPages = [
            "This is a very long text that is supposed to be longer than the box, so we have to paginate it.",
            "The user will click to see the next part of the text. This is the second part.",
            "And this is the final part. Click one more time to close this view."
        ];

        photoIcon.setInteractive().on('pointerdown', () => {
            this.showPhoto(null, textPages);
        });

        // Trigger the intro once all environment elements are loaded.
        this.friendAnimation(this.intro, 1);
    }

    showPhoto (photoName, textPages)
    {
        // Handle score update
        this.score += 1;
        this.scoreMessage.setText(this.score + '/6');
        this.photoIsVisible = true;

        // Show photo and caption for input photo name and text
        const bg = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.5).setAlpha(0);
        bg.setScrollFactor(0).setInteractive();

        const photoFrame = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'animation-photo').setAlpha(0);
        photoFrame.setScrollFactor(0).setInteractive({ pixelPerfect: true });
        
        const text = this.add.text(photoFrame.x, photoFrame.y + 200, '', { font: '32px Arial', fill: '#000000', wordWrap: { width: 800 }, align: 'left' }).setOrigin(0.5);
        text.setScrollFactor(0).setAlpha(0);

        const targets = [bg, photoFrame, text];
        let itemPhoto;
        if (photoName) {
            itemPhoto = this.add.image(photoFrame.x, photoFrame.y - 180, photoName).setAlpha(0);
            itemPhoto.setScrollFactor(0);
            itemPhoto.setDisplaySize(815, 385);
            targets.push(itemPhoto);
        } else {
            this.add.text(this.cameras.width / 2, this.cameras.height / 2, 'Photo unavailable', { font: '80px Arial', fill: '#000000' });
        }

        // Add animation
        this.tweens.add({
            targets: targets,
            alpha: 1,
            duration: 500,
            onComplete: () => {
                let currentPage = 0;
                text.setText(textPages[currentPage]);

                photoFrame.on('pointerdown', () => {
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
                            targets: targets,
                            alpha: 0,
                            duration: 500,
                            onComplete: () => {
                                bg.destroy();
                                photoFrame.destroy();
                                text.destroy();
                                if (itemPhoto) {
                                    itemPhoto.destroy();
                                }
                                this.photoIsVisible = false;
                                // Show friend animation once we reach 6/6
                                if (this.score === 6) {
                                    this.friendAnimation(this.outro, 2);
                                } 
                            }
                        });
                    }
                });
            }
        });
    }

    friendAnimation (textPages = ['default text', 'yippee!'], numScene) {
        // Show friend animation
        const bg = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.5).setAlpha(0);
        bg.setScrollFactor(0).setInteractive();

        const photoFrame = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'animation-friend').setAlpha(0);
        photoFrame.setScrollFactor(0).setInteractive({ pixelPerfect: true });
        
        const text = this.add.text(photoFrame.x, photoFrame.y + 200, '', { font: '32px Arial', fill: '#000000', wordWrap: { width: 800 }, align: 'left' }).setOrigin(0.5);
        text.setScrollFactor(0).setAlpha(0);

        const targets = [bg, photoFrame, text];

        this.tweens.add({
            targets: targets,
            alpha: 1,
            duration: 500,
            onComplete: () => {
                let currentPage = 0;
                text.setText(textPages[currentPage]);

                photoFrame.on('pointerdown', () => {
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
                            targets: targets,
                            alpha: 0,
                            duration: 500,
                            onComplete: () => {
                                bg.destroy();
                                photoFrame.destroy();
                                text.destroy();
                                this.photoIsVisible = false;
                                if (numScene === 2) {
                                    // Move on to the end scene
                                    this.scene.start('GameOver');
                                }
                            }
                        });
                    }
                });
            }
        });
    }

}
