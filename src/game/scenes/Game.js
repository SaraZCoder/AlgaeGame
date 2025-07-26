import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
        this.dialogue = null; // define dialogue property
    }

    create ()
    {
        // Retrieve pre-loaded dialogue
        this.dialogue = this.cache.json.get('dialogue');
        this.intro = ['Welcome to the wonderful world of algae!', 'Let\'s see what we can make!'];
        this.outro = ['Welcome to the wonderful world of algae!', 'Let\'s see what we can make!'];
        
        // Switches game state between exploring the environment and viewing a pop-up
        this.photoIsVisible = false; // false = explore mode
        this.cameras.main.setBackgroundColor('#c2f9abff');
        
        // Set up game environment and click-and-drag
        const bg = this.add.image(0, 0, 'game-bg').setOrigin(0, 0);
        
        this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight);
        
        this.input.on('pointermove', (pointer) => {
            if (pointer.isDown && !this.photoIsVisible)
                {
                    this.cameras.main.scrollX -= (pointer.x - pointer.prevPosition.x);
                }
            });
            
        
        // Handle score logic and photo icon display
        this.score = 0
        const photoIcon = this.add.image(1450, 75, 'photo-icon-dark').setScale(0.3);
        photoIcon.setScrollFactor(0);
        this.scoreMessage = this.add.text(1418, 50, '0/5', 
            { font: '48px Arial', fill: '#ffffffff' }
        );
        this.scoreMessage.setScrollFactor(0);
        
        // Declare interactive elements
        const fishTank = this.add.image(0, 0, 'fish-tank').setOrigin(0, 0).setInteractive({ pixelPerfect: true });
        const fertilizer = this.add.image(0, 0, 'fertilizer').setOrigin(0, 0).setInteractive({ pixelPerfect: true });
        const food = this.add.image(0, 0, 'food').setOrigin(0, 0).setInteractive({ pixelPerfect: true });
        const lotion = this.add.image(0, 0, 'lotion').setOrigin(0, 0).setInteractive({ pixelPerfect: true });
        const oil = this.add.image(0, 0, 'oil').setOrigin(0, 0).setInteractive({ pixelPerfect: true });
        this.longText = [
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
            'It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.'
        ];

        // Set object data (hasBeenClicked flag)
        oil.setData('hasBeenClicked', false);
        food.setData('hasBeenClicked', false);
        fishTank.setData('hasBeenClicked', false);
        lotion.setData('hasBeenClicked', false);
        fertilizer.setData('hasBeenClicked', false);
        
        // Handle interactions
        oil.on('pointerdown', () => {
            if (oil.getData('hasBeenClicked') === false) {
                this.showPhoto(oil, 'algae-oil', this.longText);
                oil.setData('hasBeenClicked', true);
            } else {
                this.showTemporaryText('You found this already!');
            }
        });
        food.on('pointerdown', () => {
            if (food.getData('hasBeenClicked') === false) {
                this.showPhoto(food, 'algae-food', ['Dummy text for food.']);
                food.setData('hasBeenClicked', true);
            } else {
                this.showTemporaryText('You found this already!');
            }
        });
        fishTank.on('pointerdown', () => {
            if (fishTank.getData('hasBeenClicked') === false) {
                this.showPhoto(fishTank, 'algae-fish-tank', ['Dummy text for fish tank.']);
                fishTank.setData('hasBeenClicked', true);
            } else {
                this.showTemporaryText('You found this already!');
            }
        });
        lotion.on('pointerdown', () => {
            if (lotion.getData('hasBeenClicked') === false) {
                this.showPhoto(lotion, 'algae-lotion', ['Dummy text for lotion.']);
                lotion.setData('hasBeenClicked', true);
            } else {
                this.showTemporaryText('You found this already!');
            }
        });
        fertilizer.on('pointerdown', () => {
            if (fertilizer.getData('hasBeenClicked') === false) {
                this.showPhoto(fertilizer, 'algae-fertilizer', ['Dummy text for fertilizer.', 'MORE!!!', 'MOROEEEEEOOE!']);
                fertilizer.setData('hasBeenClicked', true);
            } else {
                this.showTemporaryText('You found this already!');
            }
        });

        // Add random not it! text
        const nopeTexts = [
            'Nope!',
            'This doesn\'t seem to have algae.',
            'Try somewhere else!',
            'It could contain algae in the future though…',
            'Nah.',
            'Not this.'
        ]

        // photoIcon.setInteractive().on('pointerdown', () => {
        //     this.showPhoto(null, textPages);
        // });

        // Trigger the intro once all environment elements are loaded.
        // if (this.dialogue) {
        //     const introText = this.dialogue.intro.friend;
        //     this.friendAnimation(introText, 1);
        // } else {
        //     this.cache.json.once('add', (cache, key) => {
        //         if (key === 'dialogue') {
        //             this.dialogue = this.cache.json.get('dialogue');
        //             const introText = this.dialogue.intro.friend;
        //             this.friendAnimation(introText, 1);
        //         }
        //     });
        // }
        this.friendAnimation(this.intro, 1);

        // Handle non-algae item clicks
        this.input.on('pointerup', (pointer, gameObjects) => {
            if (this.photoIsVisible) {
                return;
            }
            const dragThreshold = 10; // pixels
            if (pointer.getDistance() < dragThreshold && gameObjects.length === 0) {
                const randText = this.getRandomText(nopeTexts);
                this.showTemporaryText(randText);
            }
        });
    }

    showPhoto (item, photoName, textPages)
    {
        // Handle score update
        this.score += 1;
        this.scoreMessage.setText(this.score + '/5');
        this.photoIsVisible = true;

        // Show photo and caption for input photo name and text
        const bg = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.5).setAlpha(0);
        bg.setScrollFactor(0).setInteractive();

        const photoFrame = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'animation-photo').setAlpha(0);
        photoFrame.setScrollFactor(0).setInteractive({ pixelPerfect: true });
        
        const text = this.add.text(photoFrame.x - 400, photoFrame.y + 150, '', { font: '32px Arial', fill: '#000000', wordWrap: { width: 800 }, align: 'left' }).setOrigin(0, 0);
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
                let isTyping = true;

                this.typewriterEffect(text, textPages[currentPage], () => {
                    isTyping = false;
                });

                const clickHandler = () => {
                    if (isTyping) {
                        this.typewriterEffect(text, textPages[currentPage], () => {
                            isTyping = false;
                        }, true);
                    } else {
                        currentPage++;
                        if (currentPage < textPages.length) {
                            isTyping = true;
                            this.typewriterEffect(text, textPages[currentPage], () => {
                                isTyping = false;
                            });
                        } else {
                            this.input.off('pointerdown', clickHandler); // Important: remove listener
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
                                    // Show friend animation once we reach 5/5
                                    if (this.score === 5) {
                                        // const outroText = this.dialogue.outro.friend;
                                        // this.friendAnimation(outroText, 2);
                                        this.friendAnimation(this.outro, 2);
                                    }
                                }
                            });
                        }
                    }
                };

                this.input.on('pointerdown', clickHandler);
            }
        });
    }

    friendAnimation (textPages = ['default text', 'yippee!'], numScene) {
        // Show friend animation
        const bg = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.5).setAlpha(0);
        bg.setScrollFactor(0).setInteractive();

        const photoFrame = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'animation-friend').setAlpha(0);
        photoFrame.setScrollFactor(0).setInteractive({ pixelPerfect: true });
        
        const text = this.add.text(photoFrame.x - 400, photoFrame.y + 150, '', { font: '32px Arial', fill: '#000000', wordWrap: { width: 800 }, align: 'left' }).setOrigin(0, 0);
        text.setScrollFactor(0).setAlpha(0);

        const targets = [bg, photoFrame, text];

        this.tweens.add({
            targets: targets,
            alpha: 1,
            duration: 500,
            onComplete: () => {
                let currentPage = 0;
                let isTyping = true;

                this.typewriterEffect(text, textPages[currentPage], () => {
                    isTyping = false;
                });

                const clickHandler = () => {
                    if (isTyping) {
                        this.typewriterEffect(text, textPages[currentPage], () => {
                            isTyping = false;
                        }, true);
                    } else {
                        currentPage++;
                        if (currentPage < textPages.length) {
                            isTyping = true;
                            this.typewriterEffect(text, textPages[currentPage], () => {
                                isTyping = false;
                            });
                        } else {
                            this.input.off('pointerdown', clickHandler);
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
                                        this.cameras.main.fadeOut(1000, 0, 0, 0);
                                        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                                            this.scene.start('GameOver');
                                        });
                                    }
                                }
                            });
                        }
                    }
                };

                this.input.on('pointerdown', clickHandler);
            }
        });
    }

    typewriterEffect(textObject, text, onComplete, skip = false) {
        if (textObject.typewriterTimer) {
            textObject.typewriterTimer.remove();
        }

        textObject.setText('');
        const words = text.split(' ');
        const baseDelay = 50;
        const perCharDelay = 15;

        if (skip) {
            textObject.setText(text);
            if (onComplete) {
                onComplete();
            }
            return;
        }

        let i = 0;
        const addNextWord = () => {
            if (i >= words.length) {
                textObject.typewriterTimer = null;
                if (onComplete) {
                    onComplete();
                }
                return;
            }

            const word = words[i];
            textObject.text += word + (i < words.length - 1 ? ' ' : '');
            i++;

            const delay = baseDelay + (word.length * perCharDelay);
            textObject.typewriterTimer = this.time.delayedCall(delay, addNextWord);
        };

        addNextWord();
    }

    showTemporaryText(text) {
        const textObject = this.add.text(
            this.cameras.main.centerX,
            50, // At the top of the screen
            text,
            {
                font: '32px Arial',
                fill: '#000000', // Black text
                backgroundColor: '#ffffff', // White background for readability
                padding: { x: 10, y: 5 }
            }
        ).setOrigin(0.5, 0);

        textObject.setScrollFactor(0); // Keep it fixed on the screen

        this.tweens.add({
            targets: textObject,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => {
                textObject.destroy();
            }
        });
    }

    getRandomText(textArray) {
        if (textArray.length === 0) {
            return undefined;
        }

        const randomIndex = Math.floor(Math.random() * textArray.length);
        return textArray[randomIndex];
    }

}
