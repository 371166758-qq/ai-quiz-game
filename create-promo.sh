#!/bin/bash
# 使用ImageMagick创建推广图
convert -size 1080x1920 -gradient:'#667eea-#764ba2' \
  -gravity center \
  -pointsize 120 -fill white -annotate +0-400 '🎮' \
  -pointsize 80 -fill white -annotate +0-200 'AI答题大师' \
  -pointsize 40 -fill white -annotate +0+50 '🤖 AI实时出题\n📚 三大题库\n🎯 智能难度' \
  -pointsize 30 -fill '#ffd700' -annotate +0+300 '扫码挑战 →' \
  promo-image.png 2>/dev/null || echo "ImageMagick未安装，使用备选方案"
