// AI答题大师 - 游戏核心代码

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#f0f0f0',
    scene: [StartScene, QuizScene, ResultScene]
};

// 题库数据
const questions = [
    {
        question: "什么是人工智能(AI)？",
        options: [
            "只能做数学计算的程序",
            "能够模拟人类智能的计算机系统",
            "只能下棋的程序",
            "只能识别图像的程序"
        ],
        answer: 1,
        explanation: "人工智能(AI)是指由人制造出来的机器所表现出来的智能，它能够模拟人类的思维过程，包括学习、推理、感知、理解语言等能力。"
    },
    {
        question: "GPT的全称是什么？",
        options: [
            "General Purpose Transformer",
            "Generative Pre-trained Transformer",
            "Global Processing Technology",
            "General Processing Tool"
        ],
        answer: 1,
        explanation: "GPT是Generative Pre-trained Transformer的缩写，意为生成式预训练变换器。"
    },
    {
        question: "深度学习的深度指的是什么？",
        options: [
            "学习的内容很深奥",
            "神经网络的层数多",
            "学习时间很长",
            "需要很深的数学知识"
        ],
        answer: 1,
        explanation: "深度学习中的深度指的是神经网络的层数。传统神经网络可能只有2-3层，而深度神经网络可能有几十甚至上百层。"
    },
    {
        question: "机器学习是人工智能的一个分支。",
        type: "truefalse",
        answer: true,
        explanation: "机器学习确实是人工智能的一个重要分支。它是实现人工智能的一种方法，通过算法让计算机从数据中学习规律。"
    },
    {
        question: "ChatGPT是基于哪个模型开发的？",
        options: [
            "GPT-3",
            "GPT-3.5/GPT-4",
            "BERT",
            "T5"
        ],
        answer: 1,
        explanation: "ChatGPT最初基于GPT-3.5模型开发，后来的版本使用了更先进的GPT-4模型。"
    },
    {
        question: "Midjourney是什么类型的AI工具？",
        options: [
            "文本生成工具",
            "图像生成工具",
            "音频生成工具",
            "视频生成工具"
        ],
        answer: 1,
        explanation: "Midjourney是一个AI图像生成工具，它可以根据文本描述生成高质量的艺术图片。"
    },
    {
        question: "Prompt Engineering是指什么？",
        options: [
            "编写计算机程序",
            "优化输入给AI的提示文本",
            "设计AI硬件",
            "维护AI服务器"
        ],
        answer: 1,
        explanation: "Prompt Engineering是指设计和优化输入给AI模型的提示文本的技术。好的提示词可以引导AI生成更准确、更有用的输出。"
    },
    {
        question: "Stable Diffusion的主要优势是什么？",
        options: [
            "只能在线使用",
            "开源免费，可以本地部署",
            "生成速度最快",
            "只能生成特定类型图片"
        ],
        answer: 1,
        explanation: "Stable Diffusion是一个开源的AI图像生成模型，用户可以在自己的电脑上本地运行。"
    },
    {
        question: "AI生成的图片可以直接用于商业用途。",
        type: "truefalse",
        answer: false,
        explanation: "AI生成图片的商业使用需要谨慎。不同平台有不同的规定，使用前需要查看具体平台的使用条款。"
    },
    {
        question: "如何提高ChatGPT的回答质量？",
        options: [
            "只需要问简单问题",
            "提供清晰的上下文和具体要求",
            "使用更长的句子",
            "多用专业术语"
        ],
        answer: 1,
        explanation: "提高ChatGPT回答质量的关键是提供清晰的上下文和具体要求。"
    }
];

// 开始场景
class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    create() {
        // 背景色
        this.cameras.main.setBackgroundColor('#667eea');

        // 标题
        this.add.text(200, 150, 'AI答题大师', {
            fontSize: '48px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 副标题
        this.add.text(200, 220, '学习AI知识，挑战高分！', {
            fontSize: '20px',
            fill: '#fff'
        }).setOrigin(0.5);

        // 开始按钮
        const startButton = this.add.text(200, 320, '开始答题', {
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#764ba2',
            padding: { x: 30, y: 15 }
        }).setOrigin(0.5);

        startButton.setInteractive({ useHandCursor: true });
        startButton.on('pointerover', () => {
            startButton.setStyle({ backgroundColor: '#8b5ca8' });
        });
        startButton.on('pointerout', () => {
            startButton.setStyle({ backgroundColor: '#764ba2' });
        });
        startButton.on('pointerdown', () => {
            this.scene.start('QuizScene');
        });

        // 游戏说明
        this.add.text(200, 480, '10道题目，每题10分，满分100分', {
            fontSize: '16px',
            fill: '#fff'
        }).setOrigin(0.5);

        this.add.text(200, 520, '答对继续，答错结束！', {
            fontSize: '16px',
            fill: '#fff'
        }).setOrigin(0.5);
    }
}

// 答题场景
class QuizScene extends Phaser.Scene {
    constructor() {
        super({ key: 'QuizScene' });
        this.score = 0;
        this.currentQuestion = 0;
        this.timeLeft = 30;
    }

    create() {
        this.score = 0;
        this.currentQuestion = 0;
        this.timeLeft = 30;

        // 设置背景
        this.cameras.main.setBackgroundColor('#f8f9fa');

        // 创建UI元素
        this.createUI();

        // 显示第一道题
        this.showQuestion();

        // 启动计时器
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.timeLeft--;
                this.timeText.setText(`时间: ${this.timeLeft}s`);

                if (this.timeLeft <= 0) {
                    this.timeOver();
                }
            },
            loop: true
        });
    }

    createUI() {
        // 分数显示
        this.add.text(20, 20, '分数:', {
            fontSize: '24px',
            fill: '#333'
        });
        this.scoreText = this.add.text(90, 20, '0', {
            fontSize: '24px',
            fill: '#667eea',
            fontStyle: 'bold'
        });

        // 题目计数
        this.add.text(300, 20, '题目:', {
            fontSize: '24px',
            fill: '#333'
        });
        this.questionText = this.add.text(370, 20, '1/10', {
            fontSize: '24px',
            fill: '#667eea',
            fontStyle: 'bold'
        });

        // 时间显示
        this.timeText = this.add.text(200, 60, '时间: 30s', {
            fontSize: '20px',
            fill: '#ff6b6b'
        }).setOrigin(0.5);

        // 题目文本
        this.questionTitle = this.add.text(200, 150, '', {
            fontSize: '22px',
            fill: '#333',
            wordWrap: { width: 360 },
            align: 'center'
        }).setOrigin(0.5);

        // 选项容器
        this.optionsContainer = [];
        for (let i = 0; i < 4; i++) {
            const optionBg = this.add.rectangle(200, 250 + i * 80, 360, 60, 0xffffff);
            optionBg.setStrokeStyle(2, 0x667eea);

            const optionText = this.add.text(200, 250 + i * 80, '', {
                fontSize: '18px',
                fill: '#333',
                wordWrap: { width: 340 },
                align: 'center'
            }).setOrigin(0.5);

            this.optionsContainer.push({ bg: optionBg, text: optionText });
        }

        // 解析文本
        this.explanationText = this.add.text(200, 570, '', {
            fontSize: '16px',
            fill: '#666',
            wordWrap: { width: 360 },
            align: 'center'
        }).setOrigin(0.5);
    }

    showQuestion() {
        if (this.currentQuestion >= 10) {
            this.endGame();
            return;
        }

        const q = questions[this.currentQuestion];
        this.questionText.setText(`${this.currentQuestion + 1}/10`);
        this.questionTitle.setText(q.question);

        // 清除之前的选项
        this.optionsContainer.forEach(opt => {
            opt.bg.setFillStyle(0xffffff);
            opt.bg.removeInteractive();
        });

        // 显示选项
        if (q.type === 'truefalse') {
            // 判断题
            this.optionsContainer[0].text.setText('✓ 正确');
            this.optionsContainer[1].text.setText('✗ 错误');
            this.optionsContainer[2].text.setText('');
            this.optionsContainer[3].text.setText('');

            this.setupOption(0, q.answer === true);
            this.setupOption(1, q.answer === false);
        } else {
            // 选择题
            q.options.forEach((opt, i) => {
                this.optionsContainer[i].text.setText(opt);
                this.setupOption(i, q.answer === i);
            });
        }

        // 清空解析
        this.explanationText.setText('');
    }

    setupOption(index, isCorrect) {
        const option = this.optionsContainer[index];
        option.bg.setInteractive({ useHandCursor: true });

        option.bg.on('pointerdown', () => {
            // 禁用所有选项
            this.optionsContainer.forEach(opt => opt.bg.removeInteractive());

            if (isCorrect) {
                // 答对
                option.bg.setFillStyle(0x4ade80);
                this.score += 10;
                this.scoreText.setText(this.score);
                
                // 显示解析
                const q = questions[this.currentQuestion];
                this.explanationText.setText('✓ ' + q.explanation);

                // 下一题
                this.time.delayedCall(2000, () => {
                    this.currentQuestion++;
                    this.showQuestion();
                });
            } else {
                // 答错
                option.bg.setFillStyle(0xf87171);
                // 显示正确答案
                const correctIndex = questions[this.currentQuestion].answer;
                if (typeof correctIndex === 'number') {
                    this.optionsContainer[correctIndex].bg.setFillStyle(0x4ade80);
                }

                // 显示解析
                const q = questions[this.currentQuestion];
                this.explanationText.setText('✗ ' + q.explanation);

                // 游戏结束
                this.time.delayedCall(2000, () => {
                    this.endGame();
                });
            }
        });

        option.bg.on('pointerover', () => {
            if (option.bg.fillColor === 0xffffff) {
                option.bg.setFillStyle(0xf0f0f0);
            }
        });

        option.bg.on('pointerout', () => {
            if (option.bg.fillColor === 0xf0f0f0) {
                option.bg.setFillStyle(0xffffff);
            }
        });
    }

    timeOver() {
        this.timer.remove();
        this.endGame();
    }

    endGame() {
        this.timer.remove();
        this.scene.start('ResultScene', { score: this.score });
    }
}

// 结果场景
class ResultScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ResultScene' });
    }

    init(data) {
        this.finalScore = data.score || 0;
    }

    create() {
        this.cameras.main.setBackgroundColor('#667eea');

        // 标题
        this.add.text(200, 150, '游戏结束', {
            fontSize: '48px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 分数
        this.add.text(200, 250, `最终得分`, {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0.5);

        this.add.text(200, 320, `${this.finalScore}分`, {
            fontSize: '64px',
            fill: '#ffd700',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 评价
        let comment = '';
        if (this.finalScore === 100) {
            comment = '完美！你是AI大师！';
        } else if (this.finalScore >= 80) {
            comment = '优秀！继续保持！';
        } else if (this.finalScore >= 60) {
            comment = '不错！还能更好！';
        } else {
            comment = '加油！再试一次！';
        }

        this.add.text(200, 400, comment, {
            fontSize: '20px',
            fill: '#fff'
        }).setOrigin(0.5);

        // 再玩一次按钮
        const replayButton = this.add.text(200, 500, '再玩一次', {
            fontSize: '28px',
            fill: '#fff',
            backgroundColor: '#764ba2',
            padding: { x: 25, y: 12 }
        }).setOrigin(0.5);

        replayButton.setInteractive({ useHandCursor: true });
        replayButton.on('pointerdown', () => {
            this.scene.start('StartScene');
        });

        // 分享按钮
        const shareButton = this.add.text(200, 560, '📤 分享战绩', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#4CAF50',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        shareButton.setInteractive({ useHandCursor: true });
        shareButton.on('pointerover', () => shareButton.setStyle({ backgroundColor: '#45a049' }));
        shareButton.on('pointerout', () => shareButton.setStyle({ backgroundColor: '#4CAF50' }));
        shareButton.on('pointerdown', () => {
            const shareText = `🎮 我在AI答题大师得了${this.finalScore}分！\n🤖 AI实时出题，你能答对几题？\n👉 https://371166758-qq.github.io/ai-quiz-game\n\n#AI答题 #知识竞赛`;
            
            if (navigator.share) {
                navigator.share({
                    title: 'AI答题大师',
                    text: shareText,
                    url: 'https://371166758-qq.github.io/ai-quiz-game'
                }).catch(() => {});
            } else {
                // 复制到剪贴板
                navigator.clipboard.writeText(shareText).then(() => {
                    alert('已复制到剪贴板！快去分享给朋友吧！');
                }).catch(() => {
                    alert(shareText);
                });
            }
        });

        // 挑战好友
        this.add.text(200, 620, '邀请好友PK，赢双倍积分！', {
            fontSize: '16px',
            fill: '#ffd700',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }
}

// 启动游戏
const game = new Phaser.Game(config);
