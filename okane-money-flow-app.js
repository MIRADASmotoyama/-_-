/*
 * おかねの流れシミュレーター - WordPress 固定ページ用（外部読み込み版）
 * ---------------------------------------------------
 * 【使い方】
 * 1. このファイルをサーバーにアップロードします。
 *    例: /contents/wp-content/uploads/2026/07/okane-money-flow-app.js
 *    ※WordPressのメディアライブラリは .js ファイルを拒否するため、
 *      FTP または ホスティングのファイルマネージャーからアップロードしてください。
 *
 * 2. 固定ページの編集画面（post=168）で「カスタムHTML」ブロックを追加し、
 *    次の2行だけを貼り付けます:
 *
 *    <div id="okane-money-flow-root"></div>
 *    <script src="https://miradas.jp/contents/wp-content/uploads/2026/07/okane-money-flow-app.js"></script>
 *
 * 固定ページに保存される内容はこの2行だけなので、WAF（セキュリティ機能）に
 * ブロックされて「更新に失敗しました。返答が正しいJSONレスポンスではありません」
 * となる問題を回避できます。
 *
 * この版は <div id="okane-money-flow-root"></div> の場所にアプリを表示します。
 * キャッシュ・高速化プラグインがスクリプトを遅延読み込みに変えても、
 * プレースホルダーの位置に正しく表示されるようにしてあります。
 */
(function(){
  "use strict";

  // currentScript は同期実行中しか取得できないため、いま捕まえておく
  var scriptEl = document.currentScript;

  function injectFonts(){
    if(document.getElementById('okane-fonts-preconnect')) return;
    var pre = document.createElement('link');
    pre.id = 'okane-fonts-preconnect';
    pre.rel = 'preconnect';
    pre.href = 'https://fonts.googleapis.com';
    document.head.appendChild(pre);
    var sheet = document.createElement('link');
    sheet.rel = 'stylesheet';
    sheet.href = 'https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@500;700;800&family=Baloo+2:wght@700;800&display=swap';
    document.head.appendChild(sheet);
  }

  function injectStyle(){
    if(document.getElementById('okane-money-flow-style')) return;
    var styleEl = document.createElement('style');
    styleEl.id = 'okane-money-flow-style';
    styleEl.textContent = "\n  #okane-money-flow-app{\n    --okane-sky:#7fd4ff;\n    --okane-sky2:#c9f0ff;\n    --okane-ink:#3a3a3a;\n    box-sizing:border-box;\n    font-family:'M PLUS Rounded 1c','Hiragino Maru Gothic ProN','Hiragino Kaku Gothic ProN',sans-serif;\n    color:var(--okane-ink);\n    background:linear-gradient(180deg,var(--okane-sky) 0%, var(--okane-sky2) 45%, #eafff0 100%);\n    border-radius:24px;\n    overflow:hidden;\n    box-shadow:0 8px 30px rgba(0,0,0,0.15);\n    max-width:1100px;\n    margin:20px auto;\n    position:relative;\n  }\n  #okane-money-flow-app *{box-sizing:border-box;}\n  #okane-money-flow-app .okane-app{\n    display:flex;\n    flex-direction:column;\n    height:680px;\n    min-height:600px;\n  }\n  #okane-money-flow-app header{\n    position:relative;\n    margin:10px 16px 6px;\n    padding:14px 22px;\n    display:flex;\n    align-items:center;\n    justify-content:space-between;\n    flex-wrap:wrap;\n    gap:10px;\n    background:linear-gradient(135deg,#ffffff 0%, #eef8ff 100%);\n    border-radius:22px;\n    box-shadow:0 6px 0 rgba(29,91,138,0.12), 0 10px 20px rgba(0,0,0,0.08);\n  }\n  #okane-money-flow-app header h1{\n    margin:0;\n    font-family:'Baloo 2','M PLUS Rounded 1c',sans-serif;\n    font-size:clamp(20px,3vw,30px);\n    font-weight:800;\n    color:#1d5b8a;\n    text-shadow:2px 2px 0 #fff;\n    display:flex;\n    align-items:center;\n    gap:8px;\n    letter-spacing:0.5px;\n  }\n  #okane-money-flow-app header p.okane-sub{\n    margin:2px 0 0;\n    font-size:13px;\n    color:#3a6a8a;\n    font-weight:500;\n  }\n  #okane-money-flow-app .okane-toolbar{\n    display:flex;\n    gap:10px;\n    flex-wrap:wrap;\n  }\n  #okane-money-flow-app .okane-btn{\n    border:none;\n    border-radius:999px;\n    padding:11px 18px 11px 10px;\n    font-size:14.5px;\n    font-weight:700;\n    font-family:inherit;\n    cursor:pointer;\n    box-shadow:0 4px 0 rgba(0,0,0,0.18);\n    transition:transform .1s ease, box-shadow .1s ease, filter .1s ease;\n    display:flex;\n    align-items:center;\n    gap:8px;\n    color:#fff;\n  }\n  #okane-money-flow-app .okane-btn .okane-icon-badge{\n    width:26px; height:26px;\n    border-radius:50%;\n    background:rgba(255,255,255,0.32);\n    display:flex; align-items:center; justify-content:center;\n    font-size:14px;\n    flex-shrink:0;\n  }\n  #okane-money-flow-app .okane-btn:hover{ filter:brightness(1.07); transform:translateY(-2px); box-shadow:0 6px 0 rgba(0,0,0,0.18); }\n  #okane-money-flow-app .okane-btn:active{\n    transform:translateY(3px);\n    box-shadow:0 1px 0 rgba(0,0,0,0.18);\n  }\n  #okane-money-flow-app .okane-btn.okane-add{background:linear-gradient(180deg,#ffb95e,#ff9f43);}\n  #okane-money-flow-app .okane-btn.okane-connect{background:linear-gradient(180deg,#57a2ec,#2e86de);}\n  #okane-money-flow-app .okane-btn.okane-connect.okane-active{background:linear-gradient(180deg,#1a5fa8,#164e8a); outline:3px solid #ffe066;}\n  #okane-money-flow-app .okane-btn.okane-reset{background:linear-gradient(180deg,#ff6b7d,#e5384f);}\n  #okane-money-flow-app .okane-btn.okane-save{background:linear-gradient(180deg,#3fc27a,#26a65b);}\n  #okane-money-flow-app .okane-btn.okane-export{background:linear-gradient(180deg,#a996ff,#8e7cff);}\n  #okane-money-flow-app .okane-btn.okane-goals{background:linear-gradient(180deg,#ffd75e,#f4b400);}\n  #okane-money-flow-app .okane-btn.okane-small{\n    padding:8px 14px;\n    font-size:13px;\n    box-shadow:0 3px 0 rgba(0,0,0,0.15);\n    border-radius:14px;\n  }\n  #okane-money-flow-app main{\n    position:relative;\n    flex:1;\n    margin:0 16px 16px;\n    border-radius:26px;\n    background:linear-gradient(180deg,#bfe9ff 0%, #d7f8e0 85%);\n    box-shadow:inset 0 0 0 5px #ffffffcc, 0 10px 26px rgba(0,0,0,0.14);\n    overflow:hidden;\n  }\n  #okane-money-flow-app .okane-scene{\n    position:absolute;\n    inset:0;\n    width:100%;\n    height:100%;\n    z-index:0;\n    pointer-events:none;\n  }\n  #okane-money-flow-app .okane-deco{\n    position:absolute;\n    font-size:32px;\n    opacity:0.6;\n    pointer-events:none;\n    z-index:1;\n    animation:okaneFloaty 6s ease-in-out infinite;\n    filter:drop-shadow(0 3px 2px rgba(0,0,0,0.08));\n  }\n  @keyframes okaneFloaty{\n    0%,100%{ transform:translateY(0) rotate(0deg); }\n    50%{ transform:translateY(-14px) rotate(4deg); }\n  }\n  #okane-money-flow-app #okaneCanvas{\n    position:absolute;\n    inset:0;\n    z-index:2;\n  }\n  #okane-money-flow-app #okaneArrowLayer{\n    position:absolute;\n    inset:0;\n    width:100%;\n    height:100%;\n    pointer-events:none;\n  }\n  #okane-money-flow-app .okane-arrow-hitline{\n    pointer-events:stroke;\n  }\n  #okane-money-flow-app .okane-arrow-hitline.okane-editable{ cursor:pointer; }\n  #okane-money-flow-app .okane-arrow-label{\n    font-size:13px;\n    font-weight:700;\n    font-family:'M PLUS Rounded 1c',sans-serif;\n    paint-order:stroke;\n    stroke:#fff;\n    stroke-width:4px;\n    pointer-events:none;\n  }\n  #okane-money-flow-app .okane-arrow-label.okane-blank{\n    font-style:italic;\n    font-size:12px;\n  }\n  #okane-money-flow-app .okane-node{\n    position:absolute;\n    transform:translate(-50%,-50%);\n    display:flex;\n    flex-direction:column;\n    align-items:center;\n    gap:3px;\n    cursor:grab;\n    user-select:none;\n    touch-action:none;\n    z-index:5;\n  }\n  #okane-money-flow-app .okane-node.okane-dragging{cursor:grabbing; z-index:20;}\n  #okane-money-flow-app .okane-node-circle{\n    position:relative;\n    width:80px;\n    height:80px;\n    border-radius:50%;\n    display:flex;\n    align-items:center;\n    justify-content:center;\n    font-size:36px;\n    box-shadow:0 6px 0 rgba(0,0,0,0.16), 0 10px 16px rgba(0,0,0,0.14);\n    border:4px solid #fff;\n    transition:box-shadow .15s ease, outline .15s ease, transform .15s ease;\n    overflow:visible;\n  }\n  #okane-money-flow-app .okane-node-circle::before{\n    content:'';\n    position:absolute;\n    top:9px; left:16px;\n    width:22px; height:13px;\n    background:rgba(255,255,255,0.6);\n    border-radius:50%;\n    transform:rotate(-24deg);\n    filter:blur(0.5px);\n    pointer-events:none;\n  }\n  #okane-money-flow-app .okane-node:hover .okane-node-circle{\n    transform:scale(1.09) rotate(-2deg);\n  }\n  #okane-money-flow-app .okane-node.okane-selected .okane-node-circle{\n    outline:4px solid #ffe066;\n    outline-offset:3px;\n    box-shadow:0 0 0 6px rgba(255,224,102,0.5), 0 6px 0 rgba(0,0,0,0.16);\n  }\n  #okane-money-flow-app .okane-node-label{\n    background:#ffffffee;\n    padding:3px 11px;\n    border-radius:10px;\n    font-size:13px;\n    font-weight:700;\n    white-space:nowrap;\n    box-shadow:0 2px 4px rgba(0,0,0,0.1);\n    max-width:140px;\n    overflow:hidden;\n    text-overflow:ellipsis;\n  }\n  #okane-money-flow-app .okane-node-del, #okane-money-flow-app .okane-node-edit{\n    position:absolute;\n    top:-6px;\n    width:23px;\n    height:23px;\n    border-radius:50%;\n    color:#fff;\n    border:2px solid #fff;\n    font-size:12px;\n    line-height:1;\n    display:none;\n    align-items:center;\n    justify-content:center;\n    cursor:pointer;\n    font-weight:800;\n    box-shadow:0 2px 3px rgba(0,0,0,0.2);\n  }\n  #okane-money-flow-app .okane-node-del{right:-6px; background:#e5384f;}\n  #okane-money-flow-app .okane-node-edit{left:-6px; background:#2e86de;}\n  #okane-money-flow-app .okane-node.okane-custom:hover .okane-node-del{display:flex;}\n  #okane-money-flow-app .okane-node:hover .okane-node-edit{display:flex;}\n  #okane-money-flow-app .okane-hint-banner{\n    position:absolute;\n    top:14px;\n    left:50%;\n    transform:translateX(-50%);\n    background:#1a5fa8;\n    color:#fff;\n    padding:9px 20px;\n    border-radius:20px;\n    font-size:14px;\n    font-weight:700;\n    box-shadow:0 4px 10px rgba(0,0,0,0.2);\n    z-index:30;\n    max-width:90%;\n    text-align:center;\n    display:none;\n  }\n  #okane-money-flow-app .okane-hint-banner.okane-show{display:block;}\n  #okane-money-flow-app .okane-stat-badge{\n    position:absolute;\n    top:14px;\n    left:14px;\n    background:#ffffffee;\n    color:#8a5a00;\n    padding:7px 12px;\n    border-radius:16px;\n    font-size:13px;\n    font-weight:800;\n    box-shadow:0 3px 8px rgba(0,0,0,0.14);\n    z-index:10;\n    display:flex;\n    align-items:center;\n    gap:8px;\n  }\n  #okane-money-flow-app .okane-ach-progress{\n    display:flex;\n    align-items:center;\n    gap:4px;\n    cursor:pointer;\n    padding:3px 10px;\n    border-radius:12px;\n    background:#fff3cd;\n    color:#8a5a00;\n  }\n  #okane-money-flow-app .okane-ach-progress:hover{ filter:brightness(0.97); }\n  #okane-money-flow-app .okane-ach-progress.okane-pulse{ animation:okaneAchPulse .5s ease; }\n  @keyframes okaneAchPulse{\n    0%{ transform:scale(1); }\n    40%{ transform:scale(1.35); }\n    100%{ transform:scale(1); }\n  }\n  #okane-money-flow-app .okane-toast{\n    position:absolute;\n    bottom:14px;\n    left:50%;\n    transform:translateX(-50%) translateY(20px);\n    background:#2d2d2d;\n    color:#fff;\n    padding:10px 22px;\n    border-radius:20px;\n    font-size:14px;\n    font-weight:700;\n    box-shadow:0 4px 10px rgba(0,0,0,0.25);\n    z-index:60;\n    opacity:0;\n    pointer-events:none;\n    transition:opacity .25s ease, transform .25s ease;\n    max-width:85%;\n    text-align:center;\n  }\n  #okane-money-flow-app .okane-toast.okane-show{\n    opacity:1;\n    transform:translateX(-50%) translateY(0);\n  }\n  #okane-money-flow-app .okane-legend{\n    position:absolute;\n    right:14px;\n    bottom:14px;\n    background:#ffffffee;\n    border-radius:18px;\n    padding:12px 15px;\n    font-size:12px;\n    line-height:1.7;\n    box-shadow:0 6px 14px rgba(0,0,0,0.14);\n    z-index:10;\n    max-width:210px;\n    border:2px solid #ffffff;\n  }\n  #okane-money-flow-app .okane-legend b{display:block; font-size:13px; margin-bottom:4px; color:#1d5b8a;}\n  #okane-money-flow-app .okane-legend .okane-row{display:flex; align-items:center; gap:6px; margin:2px 0;}\n  #okane-money-flow-app .okane-swatch{width:22px; height:0; border-top:4px solid; display:inline-block; flex-shrink:0; border-radius:2px;}\n  #okane-money-flow-app .okane-swatch.okane-dash{border-top-style:dashed;}\n  #okane-money-flow-app .okane-legend .okane-note{margin-top:5px; font-size:11px; color:#666;}\n  #okane-money-flow-app .okane-overlay{\n    position:fixed;\n    inset:0;\n    background:rgba(20,30,50,0.55);\n    display:none;\n    align-items:center;\n    justify-content:center;\n    z-index:100;\n    padding:16px;\n  }\n  #okane-money-flow-app .okane-overlay.okane-show{display:flex;}\n  #okane-money-flow-app .okane-modal{\n    background:#fff;\n    border-radius:24px;\n    padding:22px 24px;\n    max-width:560px;\n    width:100%;\n    max-height:85vh;\n    overflow:auto;\n    box-shadow:0 14px 34px rgba(0,0,0,0.32);\n  }\n  #okane-money-flow-app .okane-modal h2{\n    margin:0 0 12px;\n    font-family:'Baloo 2','M PLUS Rounded 1c',sans-serif;\n    font-size:20px;\n    color:#1d5b8a;\n    display:flex;\n    align-items:center;\n    justify-content:space-between;\n  }\n  #okane-money-flow-app .okane-modal-close{\n    background:#eee;\n    border:none;\n    width:30px;\n    height:30px;\n    border-radius:50%;\n    font-size:16px;\n    cursor:pointer;\n    font-weight:800;\n    flex-shrink:0;\n  }\n  #okane-money-flow-app .okane-icon-grid{\n    display:grid;\n    grid-template-columns:repeat(auto-fill,minmax(88px,1fr));\n    gap:10px;\n    margin-top:10px;\n  }\n  #okane-money-flow-app .okane-icon-btn{\n    border:3px solid #eee;\n    background:#fafafa;\n    border-radius:18px;\n    padding:10px 4px;\n    display:flex;\n    flex-direction:column;\n    align-items:center;\n    gap:6px;\n    cursor:pointer;\n    font-family:inherit;\n    font-weight:700;\n    font-size:12px;\n    transition:transform .1s, border-color .1s, box-shadow .1s;\n  }\n  #okane-money-flow-app .okane-icon-btn:hover{border-color:#2e86de; transform:translateY(-2px) scale(1.03); box-shadow:0 4px 10px rgba(0,0,0,0.1);}\n  #okane-money-flow-app .okane-icon-btn .okane-emoji-badge{\n    width:44px; height:44px;\n    border-radius:50%;\n    background:#fff;\n    display:flex; align-items:center; justify-content:center;\n    font-size:25px;\n    box-shadow:0 2px 5px rgba(0,0,0,0.1);\n  }\n  #okane-money-flow-app .okane-section-label{\n    font-size:13px;\n    font-weight:800;\n    color:#888;\n    margin:16px 0 2px;\n  }\n  #okane-money-flow-app .okane-purpose-hint{\n    background:#f2f7ff;\n    border-radius:12px;\n    padding:8px 12px;\n    font-size:13px;\n    margin-bottom:14px;\n    font-weight:700;\n    color:#1d5b8a;\n  }\n  #okane-money-flow-app .okane-purpose-grid{\n    display:grid;\n    grid-template-columns:repeat(2,1fr);\n    gap:12px;\n  }\n  #okane-money-flow-app .okane-purpose-card{\n    border:none;\n    border-radius:20px;\n    padding:16px 8px;\n    color:#fff;\n    font-weight:800;\n    font-size:15px;\n    display:flex;\n    flex-direction:column;\n    align-items:center;\n    gap:7px;\n    cursor:pointer;\n    box-shadow:0 4px 0 rgba(0,0,0,0.18);\n    transition:transform .12s ease, box-shadow .12s ease;\n    font-family:inherit;\n  }\n  #okane-money-flow-app .okane-purpose-card .okane-emoji-badge{\n    width:46px; height:46px;\n    border-radius:50%;\n    background:rgba(255,255,255,0.3);\n    display:flex; align-items:center; justify-content:center;\n    font-size:26px;\n  }\n  #okane-money-flow-app .okane-purpose-card:hover{transform:translateY(-2px) scale(1.03) rotate(-1deg); box-shadow:0 6px 0 rgba(0,0,0,0.18);}\n  #okane-money-flow-app .okane-purpose-card:active{transform:translateY(2px); box-shadow:0 1px 0 rgba(0,0,0,0.18);}\n  #okane-money-flow-app .okane-rename-input{\n    width:100%;\n    font-family:inherit;\n    font-size:18px;\n    font-weight:700;\n    padding:12px 14px;\n    border-radius:14px;\n    border:3px solid #cfe4fb;\n    outline:none;\n    box-sizing:border-box;\n  }\n  #okane-money-flow-app .okane-rename-input:focus{border-color:#2e86de;}\n  #okane-money-flow-app .okane-modal-actions{\n    display:flex;\n    gap:10px;\n    margin-top:16px;\n  }\n  #okane-money-flow-app .okane-modal-actions .okane-btn{flex:1; justify-content:center;}\n  #okane-money-flow-app .okane-goal-card{\n    display:flex;\n    gap:12px;\n    align-items:center;\n    padding:12px 14px;\n    border-radius:18px;\n    margin-bottom:10px;\n    background:#f2f2f2;\n    filter:grayscale(0.6);\n    opacity:0.75;\n  }\n  #okane-money-flow-app .okane-goal-card.okane-unlocked{\n    background:linear-gradient(135deg,#fff7d6,#ffe9b3);\n    filter:none;\n    opacity:1;\n    box-shadow:0 3px 8px rgba(244,180,0,0.3);\n  }\n  #okane-money-flow-app .okane-goal-card .okane-g-emoji{font-size:32px; width:44px; text-align:center; flex-shrink:0;}\n  #okane-money-flow-app .okane-goal-card .okane-g-text{flex:1;}\n  #okane-money-flow-app .okane-goal-card .okane-g-title{font-weight:800; font-size:14px;}\n  #okane-money-flow-app .okane-goal-card .okane-g-desc{font-size:12px; color:#777; margin-top:2px;}\n  #okane-money-flow-app .okane-goal-card .okane-g-status{font-size:20px; flex-shrink:0;}\n  @media (max-width:600px){\n    #okane-money-flow-app header h1{font-size:18px;}\n    #okane-money-flow-app .okane-btn{padding:9px 14px 9px 8px; font-size:13px;}\n    #okane-money-flow-app .okane-node-circle{width:64px;height:64px;font-size:28px;}\n    #okane-money-flow-app .okane-purpose-grid{grid-template-columns:repeat(2,1fr);}\n  }\n  #okane-money-flow-app .okane-insight-section{\n    margin:0 16px 20px;\n    padding:16px 18px 20px;\n    background:linear-gradient(135deg,#ffffff 0%, #f3fbff 100%);\n    border-radius:22px;\n    box-shadow:0 6px 0 rgba(29,91,138,0.10), 0 10px 20px rgba(0,0,0,0.07);\n  }\n  #okane-money-flow-app .okane-insight-topbar{\n    display:flex;\n    align-items:center;\n    justify-content:space-between;\n    flex-wrap:wrap;\n    gap:10px;\n    margin-bottom:12px;\n  }\n  #okane-money-flow-app .okane-insight-topbar h2{\n    margin:0;\n    font-family:'Baloo 2','M PLUS Rounded 1c',sans-serif;\n    font-size:clamp(17px,2.4vw,22px);\n    color:#1d5b8a;\n    display:flex;\n    align-items:center;\n    gap:6px;\n  }\n  #okane-money-flow-app .okane-insight-topbar .okane-insight-sub{\n    width:100%;\n    font-size:12.5px;\n    color:#3a6a8a;\n    font-weight:500;\n    margin-top:-6px;\n  }\n  #okane-money-flow-app .okane-btn.okane-present{background:linear-gradient(180deg,#c88bff,#9b5de5);}\n  #okane-money-flow-app .okane-btn.okane-insight-export{background:linear-gradient(180deg,#ffb2c8,#ff7aa2);}\n  #okane-money-flow-app .okane-relation-wrap{\n    position:relative;\n    width:100%;\n    height:360px;\n    border-radius:20px;\n    background:linear-gradient(180deg,#eaf7ff 0%, #f5fff2 100%);\n    box-shadow:inset 0 0 0 3px #ffffff;\n    overflow:hidden;\n  }\n  #okane-money-flow-app .okane-relation-svg{\n    position:absolute;\n    inset:0;\n    width:100%;\n    height:100%;\n  }\n  #okane-money-flow-app .okane-rel-arrow{\n    fill:none;\n    stroke-width:1.1;\n    stroke-linecap:round;\n    opacity:0.35;\n    transition:opacity .2s ease, stroke-width .2s ease;\n  }\n  #okane-money-flow-app .okane-rel-arrow.okane-rel-arrow-active{\n    opacity:1;\n    stroke-width:1.8;\n  }\n  #okane-money-flow-app .okane-rel-arrow-flow{\n    fill:none;\n    stroke:#ffffff;\n    stroke-width:0.9;\n    stroke-dasharray:2,3.5;\n    opacity:0;\n    transition:opacity .2s ease;\n    animation:okaneRelFlow 1.4s linear infinite;\n  }\n  #okane-money-flow-app .okane-rel-arrow-flow.okane-rel-arrow-active{ opacity:0.9; }\n  @keyframes okaneRelFlow{ to{ stroke-dashoffset:-11; } }\n  #okane-money-flow-app .okane-relation-node{\n    position:absolute;\n    transform:translate(-50%,-50%);\n    display:flex;\n    flex-direction:column;\n    align-items:center;\n    gap:4px;\n    cursor:pointer;\n    user-select:none;\n    z-index:3;\n    width:96px;\n  }\n  #okane-money-flow-app .okane-relation-node .okane-rel-icon{\n    width:64px;\n    height:64px;\n    border-radius:50%;\n    display:flex;\n    align-items:center;\n    justify-content:center;\n    font-size:30px;\n    border:4px solid #fff;\n    box-shadow:0 5px 0 rgba(0,0,0,0.15), 0 8px 14px rgba(0,0,0,0.12);\n    transition:transform .15s ease, box-shadow .15s ease;\n  }\n  #okane-money-flow-app .okane-relation-node:hover .okane-rel-icon,\n  #okane-money-flow-app .okane-relation-node.okane-relation-active .okane-rel-icon{\n    transform:scale(1.08);\n    box-shadow:0 0 0 5px rgba(255,224,102,0.55), 0 5px 0 rgba(0,0,0,0.15);\n  }\n  #okane-money-flow-app .okane-relation-node .okane-rel-label{\n    background:#ffffffee;\n    padding:2px 10px;\n    border-radius:10px;\n    font-size:12.5px;\n    font-weight:800;\n    white-space:nowrap;\n    box-shadow:0 2px 4px rgba(0,0,0,0.1);\n  }\n  #okane-money-flow-app .okane-relation-node[data-node='self']{ left:50%; top:52%; }\n  #okane-money-flow-app .okane-relation-node[data-node='country']{ left:50%; top:13%; }\n  #okane-money-flow-app .okane-relation-node[data-node='company']{ left:85%; top:52%; }\n  #okane-money-flow-app .okane-relation-node[data-node='bank']{ left:15%; top:52%; }\n  #okane-money-flow-app .okane-relation-node[data-node='self'] .okane-rel-icon{ background:radial-gradient(circle at 32% 28%,#fff6c9,#ffd93d 72%); }\n  #okane-money-flow-app .okane-relation-node[data-node='company'] .okane-rel-icon{ background:radial-gradient(circle at 32% 28%,#ffc2cc,#ff6b7d 72%); }\n  #okane-money-flow-app .okane-relation-node[data-node='country'] .okane-rel-icon{ background:radial-gradient(circle at 32% 28%,#bfe0ff,#42a5f5 72%); }\n  #okane-money-flow-app .okane-relation-node[data-node='bank'] .okane-rel-icon{ background:radial-gradient(circle at 32% 28%,#bdf0e6,#26a69a 72%); }\n  #okane-money-flow-app .okane-relation-mobile-list{ display:none; flex-direction:column; gap:8px; }\n  #okane-money-flow-app .okane-rel-mobile-card{\n    display:flex;\n    align-items:center;\n    gap:10px;\n    padding:10px 12px;\n    border-radius:16px;\n    background:#ffffff;\n    box-shadow:0 3px 8px rgba(0,0,0,0.08);\n    cursor:pointer;\n  }\n  #okane-money-flow-app .okane-rel-mobile-card .okane-rel-mobile-emoji{\n    width:40px; height:40px; border-radius:50%;\n    display:flex; align-items:center; justify-content:center;\n    font-size:22px; flex-shrink:0; border:3px solid #fff;\n    box-shadow:0 3px 6px rgba(0,0,0,0.15);\n  }\n  #okane-money-flow-app .okane-rel-mobile-card b{ font-size:14px; }\n  #okane-money-flow-app .okane-rel-connector{\n    display:flex;\n    flex-direction:column;\n    align-items:center;\n    gap:2px;\n    font-size:11.5px;\n    color:#3a6a8a;\n    font-weight:700;\n    padding:2px 0 2px 20px;\n    border-left:3px dashed #cfe4fb;\n    margin-left:20px;\n  }\n  #okane-money-flow-app .okane-rel-triangle-title{\n    font-size:12.5px;\n    font-weight:800;\n    color:#888;\n    margin:10px 0 2px;\n  }\n  @media (max-width:700px){\n    #okane-money-flow-app .okane-relation-wrap{ display:none; }\n    #okane-money-flow-app .okane-relation-mobile-list{ display:flex; }\n  }\n  #okane-money-flow-app .okane-insight-modal{ max-width:600px; }\n  #okane-money-flow-app .okane-insight-block{\n    margin-top:14px;\n    padding-top:12px;\n    border-top:2px dashed #eef3f8;\n  }\n  #okane-money-flow-app .okane-insight-block:first-of-type{ border-top:none; margin-top:8px; padding-top:0; }\n  #okane-money-flow-app .okane-insight-block h3{\n    margin:0 0 8px;\n    font-size:15px;\n    color:#1d5b8a;\n    display:flex;\n    align-items:center;\n    gap:6px;\n  }\n  #okane-money-flow-app .okane-keypoint-card{\n    background:#f6fbff;\n    border-radius:14px;\n    padding:9px 12px;\n    margin-bottom:8px;\n  }\n  #okane-money-flow-app .okane-keypoint-card b{ display:block; font-size:13px; color:#1d5b8a; margin-bottom:2px; }\n  #okane-money-flow-app .okane-keypoint-card span{ font-size:12.5px; color:#444; line-height:1.5; }\n  #okane-money-flow-app .okane-connection-list{ margin:0; padding-left:20px; font-size:12.5px; line-height:1.8; color:#444; }\n  #okane-money-flow-app .okane-quiz-question{\n    background:#fff7e0;\n    border-radius:14px;\n    padding:10px 12px;\n    font-size:13px;\n    font-weight:700;\n    color:#7a5200;\n    margin-bottom:8px;\n  }\n  #okane-money-flow-app .okane-quiz-hint{ font-size:11.5px; color:#888; margin-bottom:8px; }\n  #okane-money-flow-app .okane-quiz-opt{\n    display:block;\n    width:100%;\n    text-align:left;\n    border:3px solid #eee;\n    background:#fff;\n    border-radius:14px;\n    padding:9px 12px;\n    font-size:13px;\n    font-weight:700;\n    font-family:inherit;\n    cursor:pointer;\n    margin-bottom:7px;\n    transition:border-color .15s ease, transform .1s ease;\n  }\n  #okane-money-flow-app .okane-quiz-opt:hover{ border-color:#2e86de; transform:translateX(2px); }\n  #okane-money-flow-app .okane-quiz-opt.okane-quiz-correct{ border-color:#26a65b; background:#eafff2; }\n  #okane-money-flow-app .okane-quiz-opt.okane-quiz-wrong{ border-color:#e5384f; background:#fff0f2; }\n  #okane-money-flow-app .okane-quiz-explain{\n    font-size:12.5px;\n    background:#f2f7ff;\n    border-radius:12px;\n    padding:9px 12px;\n    color:#1d5b8a;\n    margin-top:4px;\n    display:none;\n  }\n  #okane-money-flow-app .okane-quiz-explain.okane-show{ display:block; }\n  #okane-money-flow-app .okane-insight-textarea{\n    width:100%;\n    min-height:70px;\n    font-family:inherit;\n    font-size:13px;\n    padding:10px 12px;\n    border-radius:14px;\n    border:3px solid #cfe4fb;\n    outline:none;\n    resize:vertical;\n    box-sizing:border-box;\n  }\n  #okane-money-flow-app .okane-insight-textarea:focus{ border-color:#2e86de; }\n  #okane-money-flow-app .okane-present-overlay{\n    position:fixed;\n    inset:0;\n    background:linear-gradient(180deg,#0d2e4a,#123a5c);\n    display:none;\n    z-index:200;\n    align-items:center;\n    justify-content:center;\n    padding:20px;\n  }\n  #okane-money-flow-app .okane-present-overlay.okane-show{ display:flex; }\n  #okane-money-flow-app .okane-present-inner{\n    background:#fff;\n    width:100%;\n    max-width:720px;\n    max-height:92vh;\n    border-radius:26px;\n    display:flex;\n    flex-direction:column;\n    overflow:hidden;\n    box-shadow:0 20px 50px rgba(0,0,0,0.4);\n  }\n  #okane-money-flow-app .okane-present-close{\n    align-self:flex-end;\n    margin:10px 12px 0 0;\n    background:#eee;\n    border:none;\n    width:32px;\n    height:32px;\n    border-radius:50%;\n    font-size:16px;\n    font-weight:800;\n    cursor:pointer;\n  }\n  #okane-money-flow-app .okane-present-slide{\n    flex:1;\n    overflow:auto;\n    padding:6px 26px 20px;\n    display:none;\n  }\n  #okane-money-flow-app .okane-present-slide.okane-show{ display:block; }\n  #okane-money-flow-app .okane-present-slide h2{\n    font-family:'Baloo 2','M PLUS Rounded 1c',sans-serif;\n    color:#1d5b8a;\n    font-size:22px;\n    display:flex;\n    align-items:center;\n    gap:8px;\n  }\n  #okane-money-flow-app .okane-present-summary{\n    display:flex;\n    flex-direction:column;\n    align-items:center;\n    justify-content:center;\n    text-align:center;\n    gap:14px;\n    padding:40px 10px;\n  }\n  #okane-money-flow-app .okane-present-summary .okane-present-big{\n    font-size:26px;\n    font-weight:800;\n    color:#1d5b8a;\n    font-family:'Baloo 2','M PLUS Rounded 1c',sans-serif;\n  }\n  #okane-money-flow-app .okane-present-nav{\n    display:flex;\n    align-items:center;\n    justify-content:space-between;\n    gap:10px;\n    padding:12px 20px;\n    border-top:2px solid #f0f0f0;\n  }\n  #okane-money-flow-app .okane-present-dots{ display:flex; gap:6px; }\n  #okane-money-flow-app .okane-present-dot{ width:9px; height:9px; border-radius:50%; background:#ddd; }\n  #okane-money-flow-app .okane-present-dot.okane-active{ background:#2e86de; }\n  #okane-money-flow-app .okane-confetti-piece{\n    position:absolute;\n    top:-10px;\n    width:8px;\n    height:14px;\n    z-index:80;\n    pointer-events:none;\n    animation:okaneConfettiFall 1.3s ease-in forwards;\n  }\n  @keyframes okaneConfettiFall{\n    0%{ transform:translateY(0) rotate(0deg); opacity:1; }\n    100%{ transform:translateY(220px) rotate(340deg); opacity:0; }\n  }\n  @media (max-width:600px){\n    #okane-money-flow-app .okane-insight-topbar h2{ font-size:16px; }\n    #okane-money-flow-app .okane-relation-node{ width:78px; }\n    #okane-money-flow-app .okane-relation-node .okane-rel-icon{ width:52px; height:52px; font-size:24px; }\n  }\n";
    document.head.appendChild(styleEl);
  }

  function injectMarkup(){
    if(document.getElementById('okane-money-flow-app')) return; // already inserted (avoid duplicates)
    var html = '<div id="okane-money-flow-app">\n<div class="okane-app">\n  <header>\n    <div>\n      <h1>&#x1F4B0; おかねの流れシミュレーター</h1>\n      <p class="okane-sub">アイテムをつないで、おかねと モノ・気持ちの流れを つくってみよう！</p>\n    </div>\n    <div class="okane-toolbar">\n      <button class="okane-btn okane-add" id="okaneBtnAdd"><span class="okane-icon-badge">➕</span>アイテムを追加</button>\n      <button class="okane-btn okane-connect" id="okaneBtnConnect"><span class="okane-icon-badge">&#x1F517;</span>矢印をつなぐ</button>\n      <button class="okane-btn okane-goals" id="okaneBtnGoals"><span class="okane-icon-badge">&#x1F3C5;</span>もくひょう</button>\n      <button class="okane-btn okane-save" id="okaneBtnSave"><span class="okane-icon-badge">&#x1F4BE;</span>保存</button>\n      <button class="okane-btn okane-export" id="okaneBtnExport"><span class="okane-icon-badge">&#x1F5BC;&#xFE0F;</span>画像を保存</button>\n      <button class="okane-btn okane-reset" id="okaneBtnReset"><span class="okane-icon-badge">&#x1F504;</span>リセット</button>\n    </div>\n  </header>\n\n  <main>\n    <svg class="okane-scene" viewBox="0 0 1000 650" preserveAspectRatio="none">\n      <circle cx="70" cy="70" r="55" fill="#ffe066" opacity="0.22"></circle>\n      <circle cx="70" cy="70" r="34" fill="#ffe066" opacity="0.55"></circle>\n      <path d="M0,650 L0,585 Q120,548 250,578 T500,570 T750,582 T1000,565 L1000,650 Z" fill="#bff2c8" opacity="0.75"></path>\n      <g opacity="0.30" fill="#7fb99a">\n        <rect x="60" y="520" width="46" height="70" rx="6"></rect>\n        <polygon points="55,520 83,495 111,520"></polygon>\n        <rect x="150" y="540" width="60" height="55" rx="6"></rect>\n        <rect x="230" y="510" width="42" height="85" rx="6"></rect>\n        <polygon points="225,510 251,486 277,510"></polygon>\n        <rect x="760" y="535" width="50" height="60" rx="6"></rect>\n        <rect x="840" y="515" width="44" height="82" rx="6"></rect>\n        <polygon points="835,515 862,492 889,515"></polygon>\n        <rect x="910" y="545" width="56" height="52" rx="6"></rect>\n      </g>\n    </svg>\n    <div class="okane-deco" style="left:6%; top:8%;">☁&#xFE0F;</div>\n    <div class="okane-deco" style="left:88%; top:10%; animation-delay:1.2s;">⭐</div>\n    <div class="okane-deco" style="left:92%; top:56%; animation-delay:2.4s;">&#x1F388;</div>\n    <div class="okane-deco" style="left:4%; top:66%; animation-delay:0.6s;">☁&#xFE0F;</div>\n    <div id="okaneCanvas">\n      <svg id="okaneArrowLayer" viewBox="0 0 1000 650" preserveAspectRatio="none">\n        <defs></defs>\n        <g id="okaneArrowGroup"></g>\n      </svg>\n    </div>\n    <div class="okane-hint-banner" id="okaneHintBanner"></div>\n    <div class="okane-stat-badge" id="okaneStatBadge">\n      <span>&#x1F517; <span id="okaneStatCount">0</span> くみ</span>\n      <span class="okane-ach-progress" id="okaneAchProgressWrap" title="もくひょうを見る">&#x1F3C5; <span id="okaneAchProgress">0</span>/<span id="okaneAchTotal">0</span></span>\n    </div>\n    <div class="okane-toast" id="okaneToast"></div>\n    <div class="okane-legend" id="okaneLegend">\n      <b>&#x1F50D; 見かた（いろ）</b>\n      <div id="okaneLegendRows"></div>\n      <div class="okane-note">実線＝いろで見てね（文字なし）</div>\n      <div class="okane-note">点線＝お返し。クリックしてじぶんで書いてね ✏&#xFE0F;</div>\n    </div>\n  </main>\n</div>\n\n<section class="okane-insight-section" id="okaneInsightSection">\n  <div class="okane-insight-topbar">\n    <h2>&#x1F91D; わたし・会社・国・金融機関のつながりマップ</h2>\n    <div class="okane-insight-sub">アイコンをタップすると くわしいお話が見られるよ！</div>\n    <div class="okane-toolbar">\n      <button class="okane-btn okane-present" id="okaneBtnPresent"><span class="okane-icon-badge">&#x1F3A4;</span>発表モード</button>\n      <button class="okane-btn okane-small okane-insight-export" id="okaneBtnInsightExport"><span class="okane-icon-badge">&#x1F5BC;&#xFE0F;</span>発表シートを保存</button>\n    </div>\n  </div>\n  <div class="okane-relation-wrap" id="okaneRelationWrap">\n    <svg class="okane-relation-svg" id="okaneRelationSvg" viewBox="0 0 100 100" preserveAspectRatio="none">\n      <g id="okaneRelationArrowGroup"></g>\n    </svg>\n    <div class="okane-relation-node" data-node="self"><div class="okane-rel-icon">&#x1F9D2;</div><div class="okane-rel-label">わたし</div></div>\n    <div class="okane-relation-node" data-node="country"><div class="okane-rel-icon">&#x1F3DB;&#xFE0F;</div><div class="okane-rel-label">国（税金）</div></div>\n    <div class="okane-relation-node" data-node="company"><div class="okane-rel-icon">&#x1F3E2;</div><div class="okane-rel-label">会社</div></div>\n    <div class="okane-relation-node" data-node="bank"><div class="okane-rel-icon">&#x1F3E6;</div><div class="okane-rel-label">金融機関</div></div>\n  </div>\n  <div class="okane-relation-mobile-list" id="okaneRelationMobileList"></div>\n</section>\n\n<!-- Insight Detail Modal -->\n<div class="okane-overlay" id="okaneInsightOverlay">\n  <div class="okane-modal okane-insight-modal">\n    <h2 id="okaneInsightTitle">タイトル <button class="okane-modal-close" id="okaneCloseInsight">×</button></h2>\n    <div id="okaneInsightBody"></div>\n  </div>\n</div>\n\n<!-- Self Recap Modal -->\n<div class="okane-overlay" id="okaneSelfOverlay">\n  <div class="okane-modal">\n    <h2>&#x1F9D2; わたしのお金の使い道 <button class="okane-modal-close" id="okaneCloseSelf">×</button></h2>\n    <div id="okaneSelfBody"></div>\n  </div>\n</div>\n\n<!-- Presentation Mode -->\n<div class="okane-present-overlay" id="okanePresentOverlay">\n  <div class="okane-present-inner">\n    <button class="okane-present-close" id="okanePresentClose">×</button>\n    <div class="okane-present-slide" id="okanePresentSlide0">\n      <h2>&#x1F91D; わたし・会社・国・金融機関</h2>\n      <div class="okane-relation-wrap" id="okanePresentMap" style="height:300px;">\n        <svg class="okane-relation-svg" id="okanePresentSvg" viewBox="0 0 100 100" preserveAspectRatio="none"><g id="okanePresentArrowGroup"></g></svg>\n        <div class="okane-relation-node" data-node="self"><div class="okane-rel-icon">&#x1F9D2;</div><div class="okane-rel-label">わたし</div></div>\n        <div class="okane-relation-node" data-node="country"><div class="okane-rel-icon">&#x1F3DB;&#xFE0F;</div><div class="okane-rel-label">国（税金）</div></div>\n        <div class="okane-relation-node" data-node="company"><div class="okane-rel-icon">&#x1F3E2;</div><div class="okane-rel-label">会社</div></div>\n        <div class="okane-relation-node" data-node="bank"><div class="okane-rel-icon">&#x1F3E6;</div><div class="okane-rel-label">金融機関</div></div>\n      </div>\n      <p class="okane-purpose-hint">わたしを中心に、会社・国・金融機関とお金がぐるぐる回っているよ。矢印にカーソルを合わせてみよう！</p>\n    </div>\n    <div class="okane-present-slide" id="okanePresentSlide1"></div>\n    <div class="okane-present-slide" id="okanePresentSlide2"></div>\n    <div class="okane-present-slide" id="okanePresentSlide3"></div>\n    <div class="okane-present-slide" id="okanePresentSlide4">\n      <div class="okane-present-summary">\n        <div style="font-size:56px;">&#x1F4B0;&#x2728;</div>\n        <div class="okane-present-big">お金の裏には、必ず人がいる</div>\n        <p style="max-width:440px; color:#555; font-size:14px; line-height:1.8;">会社ではたらく人、税金をつかって国をうごかす人、銀行でお金をあずかる人。<br>お金がうごくたびに、その先には いつも「だれか」がいるんだね。</p>\n      </div>\n    </div>\n    <div class="okane-present-nav">\n      <button class="okane-btn okane-small" id="okanePresentPrev" style="background:#aaa;">＜ 前へ</button>\n      <div class="okane-present-dots" id="okanePresentDots"></div>\n      <button class="okane-btn okane-small" id="okanePresentNext" style="background:#2e86de;">次へ ＞</button>\n    </div>\n  </div>\n</div>\n\n<!-- Add Item Modal -->\n<div class="okane-overlay" id="okaneAddOverlay">\n  <div class="okane-modal">\n    <h2>アイテムをえらんでね <button class="okane-modal-close" id="okaneCloseAdd">×</button></h2>\n    <div class="okane-section-label">&#x1F9D1; 人をふやす</div>\n    <div class="okane-icon-grid" id="okaneIconGridPeople"></div>\n    <div class="okane-section-label">&#x1F3E2; 会社・おみせ・ばしょ</div>\n    <div class="okane-icon-grid" id="okaneIconGridMain"></div>\n    <div class="okane-section-label">✏&#xFE0F; もっといろいろ（カスタム）</div>\n    <div class="okane-icon-grid" id="okaneIconGridCustom"></div>\n  </div>\n</div>\n\n<!-- Purpose Modal -->\n<div class="okane-overlay" id="okanePurposeOverlay">\n  <div class="okane-modal">\n    <h2>なにをする？ <button class="okane-modal-close" id="okaneClosePurpose">×</button></h2>\n    <div class="okane-purpose-hint" id="okanePurposeHint"></div>\n    <div class="okane-purpose-grid" id="okanePurposeGrid"></div>\n    <div id="okaneOtherInputWrap" style="display:none; margin-top:14px;">\n      <input type="text" id="okaneOtherInput" class="okane-rename-input" maxlength="14" placeholder="じぶんで名前をつけよう">\n      <div class="okane-modal-actions">\n        <button class="okane-btn okane-small" id="okaneOtherCancel" style="background:#aaa;">もどる</button>\n        <button class="okane-btn okane-small" id="okaneOtherOk" style="background:#26c6da;">きめる</button>\n      </div>\n    </div>\n  </div>\n</div>\n\n<!-- Rename Node Modal -->\n<div class="okane-overlay" id="okaneRenameOverlay">\n  <div class="okane-modal" style="max-width:360px;">\n    <h2>なまえを変える <button class="okane-modal-close" id="okaneCloseRename">×</button></h2>\n    <input type="text" id="okaneRenameInput" class="okane-rename-input" maxlength="14" placeholder="なまえを入力">\n    <div class="okane-modal-actions">\n      <button class="okane-btn okane-small" id="okaneRenameCancel" style="background:#aaa;">キャンセル</button>\n      <button class="okane-btn okane-small" id="okaneRenameOk" style="background:#2e86de;">きめる</button>\n    </div>\n  </div>\n</div>\n\n<!-- Arrow Label Modal -->\n<div class="okane-overlay" id="okaneArrowLabelOverlay">\n  <div class="okane-modal" style="max-width:360px;">\n    <h2 id="okaneArrowLabelTitle">ラベルを入力 <button class="okane-modal-close" id="okaneCloseArrowLabel">×</button></h2>\n    <div class="okane-purpose-hint" id="okaneArrowLabelHint"></div>\n    <input type="text" id="okaneArrowLabelInput" class="okane-rename-input" maxlength="16" placeholder="なにが返ってくる？">\n    <div class="okane-modal-actions">\n      <button class="okane-btn okane-small" id="okaneArrowLabelCancel" style="background:#aaa;">あとで</button>\n      <button class="okane-btn okane-small" id="okaneArrowLabelOk" style="background:#2e86de;">きめる</button>\n    </div>\n  </div>\n</div>\n\n<!-- Goals Modal -->\n<div class="okane-overlay" id="okaneGoalsOverlay">\n  <div class="okane-modal" style="max-width:440px;">\n    <h2>&#x1F3C5; もくひょう <button class="okane-modal-close" id="okaneCloseGoals">×</button></h2>\n    <div class="okane-purpose-hint">クリアすると バッジが ひかるよ！がんばろう。</div>\n    <div id="okaneGoalsList"></div>\n  </div>\n</div>\n</div><!-- /#okane-money-flow-app -->';
    // 1) 固定ページに貼ったプレースホルダー <div id="okane-money-flow-root"></div> を最優先
    var mount = document.getElementById('okane-money-flow-root');
    if(mount){
      mount.innerHTML = html;
      return;
    }
    // 2) プレースホルダーがなければ script タグの直前に挿入
    if(scriptEl && scriptEl.parentNode){
      scriptEl.insertAdjacentHTML('beforebegin', html);
      return;
    }
    // 3) 最終フォールバック: body の末尾に追加
    var holder = document.createElement('div');
    holder.innerHTML = html;
    document.body.appendChild(holder.firstElementChild);
  }

  // ---- original app logic (unchanged) ----

  function startApp(){

  const STORAGE_KEY = 'moneyFlowSimulator_wp_v1';
  const SVG_NS = 'http://www.w3.org/2000/svg';

  const root = document.getElementById('okane-money-flow-app');
  if(!root){ return; }
  function $(id){ return root.querySelector('#'+id); }

  // ---------- 6 purposes, each with its own vivid color ----------
  const PURPOSES = [
    {key:'buy',    mainLabel:'買う',   color:'#ff5252', emoji:'\u{1F6CD}\u{FE0F}', desc:'お店で買いものをする'},
    {key:'save',   mainLabel:'貯める', color:'#ffca28', emoji:'\u{1F437}', desc:'お金をためる（貯金）'},
    {key:'tax',    mainLabel:'税金',   color:'#ab47bc', emoji:'\u{1F3DB}\u{FE0F}', desc:'税金をおさめる'},
    {key:'invest', mainLabel:'投資',   color:'#26a69a', emoji:'\u{1F4C8}', desc:'会社などにとうしする'},
    {key:'work',   mainLabel:'稼ぐ',   color:'#42a5f5', emoji:'\u{1F4AA}', desc:'働いてお金をかせぐ'},
    {key:'other',  mainLabel:'その他', color:'#ec6ead', emoji:'✨', desc:'じぶんで決める', custom:true}
  ];

  // ---------- Achievements (sticky once unlocked; not reset by the reset button) ----------
  const ACHIEVEMENTS = [
    {id:'firstPair', emoji:'\u{1F517}', title:'はじめの一歩', desc:'はじめて じぶんで矢印をつなげてみよう',
      check:function(){ return state.stats.pairsCreated >= 1; }},
    {id:'allTypes', emoji:'\u{1F308}', title:'ぜんしゅるいせいは！',
      desc:'6つのりゆう（買う・貯める・税金・投資・稼ぐ・その他）を、ぜんぶ1回はつかってみよう',
      check:function(){
        const used = new Set(state.arrows.map(a=>a.purposeKey).filter(Boolean));
        return PURPOSES.every(p=>used.has(p.key));
      }},
    {id:'triangle', emoji:'\u{1F53A}', title:'さんかくけいたっせい！',
      desc:'3つのアイテムが おたがいにつながる「さんかく」をつくろう',
      check:function(){ return hasTriangle(); }},
    {id:'quad', emoji:'\u{1F537}', title:'しかくけいたっせい！',
      desc:'4つのアイテムが わになってつながる「しかく」をつくろう',
      check:function(){ return hasQuadrilateral(); }},
    {id:'fivePairs', emoji:'\u{1F3D7}\u{FE0F}', title:'5くみマスター', desc:'ぜんぶで5くみの矢印をつくろう',
      check:function(){ return state.stats.pairsCreated >= 5; }},
    {id:'tenPairs', emoji:'\u{1F3D9}\u{FE0F}', title:'10くみマスター', desc:'ぜんぶで10くみの矢印をつくろう。まちが にぎやかに！',
      check:function(){ return state.stats.pairsCreated >= 10; }},
    {id:'addItem', emoji:'\u{1F9D1}\u{200D}\u{1F91D}\u{200D}\u{1F9D1}', title:'なかまがふえた', desc:'じぶんでアイテムをついかしてみよう',
      check:function(){ return state.stats.itemsAdded >= 1; }},
    {id:'rename', emoji:'✏\u{FE0F}', title:'なまえはかせ', desc:'アイテムのなまえを じぶんで変えてみよう',
      check:function(){ return state.stats.renamed >= 1; }},
    {id:'save', emoji:'\u{1F4BE}', title:'きろくたつじん', desc:'「保存」ボタンで じぶんの作品をほぞんしよう',
      check:function(){ return state.stats.saved >= 1; }},
    {id:'export', emoji:'\u{1F5BC}\u{FE0F}', title:'シェアマスター', desc:'「画像を保存」で 作品を絵にして先生にみせよう',
      check:function(){ return state.stats.exported >= 1; }}
  ];

  function hasTriangle(){
    const ids = state.nodes.map(n=>n.id);
    const edges = new Set();
    state.arrows.forEach(a=>{ edges.add([a.from,a.to].sort().join('|')); });
    for(let i=0;i<ids.length;i++){
      for(let j=i+1;j<ids.length;j++){
        for(let k=j+1;k<ids.length;k++){
          const e1=[ids[i],ids[j]].sort().join('|');
          const e2=[ids[j],ids[k]].sort().join('|');
          const e3=[ids[i],ids[k]].sort().join('|');
          if(edges.has(e1) && edges.has(e2) && edges.has(e3)) return true;
        }
      }
    }
    return false;
  }

  function hasQuadrilateral(){
    const ids = state.nodes.map(n=>n.id);
    const edges = new Set();
    state.arrows.forEach(a=>{ edges.add([a.from,a.to].sort().join('|')); });
    function hasEdge(x,y){ return edges.has([x,y].sort().join('|')); }
    const n = ids.length;
    for(let i=0;i<n;i++){
      for(let j=i+1;j<n;j++){
        for(let k=j+1;k<n;k++){
          for(let l=k+1;l<n;l++){
            const a=ids[i], b=ids[j], c=ids[k], d=ids[l];
            const orders = [[a,b,c,d],[a,b,d,c],[a,c,b,d]];
            for(let o=0;o<orders.length;o++){
              const seq = orders[o];
              if(hasEdge(seq[0],seq[1]) && hasEdge(seq[1],seq[2]) && hasEdge(seq[2],seq[3]) && hasEdge(seq[3],seq[0])){
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }

  const PEOPLE_ICONS = [
    {icon:'\u{1F9D2}', label:'子ども'}, {icon:'\u{1F466}', label:'男の子'}, {icon:'\u{1F467}', label:'女の子'},
    {icon:'\u{1F468}', label:'お父さん'}, {icon:'\u{1F469}', label:'お母さん'}, {icon:'\u{1F474}', label:'おじいちゃん'},
    {icon:'\u{1F475}', label:'おばあちゃん'}, {icon:'\u{1F9D1}\u{200D}\u{1F3EB}', label:'先生'}, {icon:'\u{1F9D1}\u{200D}\u{1F91D}\u{200D}\u{1F9D1}', label:'友だち'}
  ];
  const BASE_ICONS = [
    {icon:'\u{1F3EA}', label:'コンビニ'}, {icon:'\u{1F9F8}', label:'おもちゃ屋'}, {icon:'\u{1F3AE}', label:'ゲーム会社'},
    {icon:'\u{1F37D}\u{FE0F}', label:'レストラン'}, {icon:'\u{1F3E0}', label:'家'}, {icon:'\u{1F3EB}', label:'学校'},
    {icon:'\u{1F4DA}', label:'習い事'}, {icon:'✏\u{FE0F}', label:'塾'}, {icon:'⚽', label:'スポーツクラブ'},
    {icon:'\u{1F3A1}', label:'遊園地'}, {icon:'\u{1F4F1}', label:'サブスク'}, {icon:'\u{1F3E5}', label:'びょういん'},
    {icon:'\u{1F436}', label:'ペットショップ'}, {icon:'\u{1F3AC}', label:'えいがかん'}
  ];
  const CUSTOM_ICONS = [
    {icon:'⭐', label:'とくべつ'}, {icon:'\u{1F3A8}', label:'アート'}, {icon:'\u{1F3B5}', label:'おんがく'},
    {icon:'\u{1F6B2}', label:'のりもの'}, {icon:'\u{1F382}', label:'おいわい'}, {icon:'\u{1F333}', label:'こうえん'},
    {icon:'\u{1F4EE}', label:'ゆうびんきょく'}, {icon:'\u{1F33E}', label:'のうか'}
  ];
  const NODE_PALETTE = ['#4dd0e1','#ff8a80','#ffd54f','#aed581','#ba68c8','#4fc3f7','#ffab91','#90caf9'];

  let state = null;

  function initialState(){
    return {
      nodes:[
        {id:'person1', type:'base', icon:'\u{1F9D2}', label:'じぶん', x:15, y:30, color:'#ffd93d'},
        {id:'person2', type:'base', icon:'\u{1F46A}', label:'かぞく', x:15, y:72, color:'#ffe066'},
        {id:'convenience', type:'base', icon:'\u{1F3EA}', label:'コンビニ', x:48, y:50, color:'#ff9f43'},
        {id:'gov', type:'base', icon:'\u{1F3DB}\u{FE0F}', label:'国（政府）', x:80, y:25, color:'#6bcb77'},
        {id:'bank', type:'base', icon:'\u{1F3E6}', label:'金融機関（銀行）', x:80, y:75, color:'#8e7cff'}
      ],
      arrows:[
        {id:'a1', pairId:'p1', purposeKey:'buy', from:'person1', to:'convenience', style:'solid', color:'#ff5252', label:'買う'},
        {id:'a2', pairId:'p1', purposeKey:'buy', from:'convenience', to:'person1', style:'dashed', color:lighten('#ff5252',0.55), label:''}
      ],
      customCount:0, idSeq:1, connectMode:false, selectedSource:null,
      achievements:defaultAchievements(),
      stats:{pairsCreated:0, itemsAdded:0, renamed:0, saved:0, exported:0}
    };
  }

  function defaultAchievements(){
    const obj = {};
    ACHIEVEMENTS.forEach(a=>{ obj[a.id] = false; });
    return obj;
  }

  function lighten(hex, amount){
    const num = parseInt(hex.replace('#',''),16);
    let r=(num>>16)&0xff, g=(num>>8)&0xff, b=num&0xff;
    r = Math.round(r + (255-r)*amount); g = Math.round(g + (255-g)*amount); b = Math.round(b + (255-b)*amount);
    return '#' + [r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
  }
  function darken(hex, amount){
    amount = amount === undefined ? 0.35 : amount;
    const num = parseInt(hex.replace('#',''),16);
    let r=(num>>16)&0xff, g=(num>>8)&0xff, b=num&0xff;
    r = Math.round(r*(1-amount)); g = Math.round(g*(1-amount)); b = Math.round(b*(1-amount));
    return '#' + [r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
  }

  function saveState(){
    try{
      const data = {
        nodes: state.nodes, arrows: state.arrows, customCount: state.customCount,
        idSeq: state.idSeq, achievements: state.achievements, stats: state.stats
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }catch(e){ /* storage unavailable - ignore */ }
  }
  function loadSavedState(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return null;
      const data = JSON.parse(raw);
      if(!data || !Array.isArray(data.nodes) || !Array.isArray(data.arrows)) return null;
      return data;
    }catch(e){ return null; }
  }

  const canvas = $('okaneCanvas');
  const svgDefs = root.querySelector('#okaneArrowLayer defs');
  const svgGroup = $('okaneArrowGroup');
  const hintBanner = $('okaneHintBanner');
  const toastEl = $('okaneToast');
  const legendRows = $('okaneLegendRows');
  const statCount = $('okaneStatCount');
  const achProgress = $('okaneAchProgress');
  const achTotal = $('okaneAchTotal');
  const achProgressWrap = $('okaneAchProgressWrap');
  const btnAdd = $('okaneBtnAdd');
  const btnConnect = $('okaneBtnConnect');
  const btnReset = $('okaneBtnReset');
  const btnSave = $('okaneBtnSave');
  const btnExport = $('okaneBtnExport');
  const btnGoals = $('okaneBtnGoals');
  const addOverlay = $('okaneAddOverlay');
  const closeAdd = $('okaneCloseAdd');
  const iconGridPeople = $('okaneIconGridPeople');
  const iconGridMain = $('okaneIconGridMain');
  const iconGridCustom = $('okaneIconGridCustom');
  const purposeOverlay = $('okanePurposeOverlay');
  const closePurpose = $('okaneClosePurpose');
  const purposeHint = $('okanePurposeHint');
  const purposeGrid = $('okanePurposeGrid');
  const otherInputWrap = $('okaneOtherInputWrap');
  const otherInput = $('okaneOtherInput');
  const otherOk = $('okaneOtherOk');
  const otherCancel = $('okaneOtherCancel');
  const renameOverlay = $('okaneRenameOverlay');
  const closeRename = $('okaneCloseRename');
  const renameInput = $('okaneRenameInput');
  const renameOk = $('okaneRenameOk');
  const renameCancel = $('okaneRenameCancel');
  const arrowLabelOverlay = $('okaneArrowLabelOverlay');
  const arrowLabelTitle = $('okaneArrowLabelTitle');
  const arrowLabelHint = $('okaneArrowLabelHint');
  const arrowLabelInput = $('okaneArrowLabelInput');
  const arrowLabelOk = $('okaneArrowLabelOk');
  const arrowLabelCancel = $('okaneArrowLabelCancel');
  const closeArrowLabel = $('okaneCloseArrowLabel');
  const goalsOverlay = $('okaneGoalsOverlay');
  const closeGoals = $('okaneCloseGoals');
  const goalsList = $('okaneGoalsList');

  let pendingTarget = null;
  let renameTargetId = null;
  let arrowLabelTargetId = null;
  let toastTimer = null;

  function showToast(msg){
    toastEl.textContent = msg;
    toastEl.classList.add('okane-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=> toastEl.classList.remove('okane-show'), 2200);
  }

  function buildLegend(){
    legendRows.innerHTML = '';
    PURPOSES.forEach(p=>{
      const row = document.createElement('div');
      row.className = 'okane-row';
      row.innerHTML = `<span class="okane-swatch" style="border-color:${p.color}"></span> ${p.emoji} ${p.mainLabel}`;
      legendRows.appendChild(row);
    });
  }
  buildLegend();

  function renderGoals(){
    goalsList.innerHTML = '';
    ACHIEVEMENTS.forEach(ach=>{
      const unlocked = !!state.achievements[ach.id];
      const div = document.createElement('div');
      div.className = 'okane-goal-card' + (unlocked ? ' okane-unlocked' : '');
      div.innerHTML = `<div class="okane-g-emoji">${ach.emoji}</div><div class="okane-g-text"><div class="okane-g-title">${ach.title}</div><div class="okane-g-desc">${ach.desc}</div></div><div class="okane-g-status">${unlocked ? '✅' : '\u{1F512}'}</div>`;
      goalsList.appendChild(div);
    });
  }
  function openGoals(){ renderGoals(); goalsOverlay.classList.add('okane-show'); }
  btnGoals.addEventListener('click', openGoals);
  achProgressWrap.addEventListener('click', openGoals);
  closeGoals.addEventListener('click', ()=> goalsOverlay.classList.remove('okane-show'));
  goalsOverlay.addEventListener('click', (e)=>{ if(e.target===goalsOverlay) goalsOverlay.classList.remove('okane-show'); });

  achTotal.textContent = ACHIEVEMENTS.length;
  let lastShownProgress = 0;

  function checkAchievements(){
    let unlockedNow = [];
    ACHIEVEMENTS.forEach(ach=>{
      if(!state.achievements[ach.id] && ach.check()){
        state.achievements[ach.id] = true;
        unlockedNow.push(ach);
      }
    });
    const unlockedCount = ACHIEVEMENTS.filter(a=>state.achievements[a.id]).length;
    achProgress.textContent = unlockedCount;
    if(unlockedCount > lastShownProgress){
      achProgressWrap.classList.remove('okane-pulse');
      void achProgressWrap.offsetWidth;
      achProgressWrap.classList.add('okane-pulse');
    }
    lastShownProgress = unlockedCount;
    if(unlockedNow.length){
      saveState();
      unlockedNow.forEach(a=> showToast(`${a.emoji} 「${a.title}」たっせい！すごい！`));
    }
  }

  function buildIconGrid(container, icons, onPick){
    container.innerHTML = '';
    icons.forEach(item=>{
      const b = document.createElement('button');
      b.className = 'okane-icon-btn';
      b.innerHTML = `<span class="okane-emoji-badge">${item.icon}</span><span>${item.label}</span>`;
      b.addEventListener('click', ()=>{ onPick(item.icon, item.label); addOverlay.classList.remove('okane-show'); });
      container.appendChild(b);
    });
  }
  buildIconGrid(iconGridPeople, PEOPLE_ICONS, addCustomNode);
  buildIconGrid(iconGridMain, BASE_ICONS, addCustomNode);
  buildIconGrid(iconGridCustom, CUSTOM_ICONS, addCustomNode);

  function buildPurposeGrid(){
    purposeGrid.innerHTML = '';
    PURPOSES.forEach(p=>{
      const b = document.createElement('button');
      b.className = 'okane-purpose-card';
      b.style.background = p.color;
      b.innerHTML = `<span class="okane-emoji-badge">${p.emoji}</span><span>${p.mainLabel}</span>`;
      b.title = p.desc;
      b.addEventListener('click', ()=>{
        if(p.custom){
          otherInputWrap.style.display = 'block';
          otherInput.value = '';
          setTimeout(()=>otherInput.focus(), 30);
        } else {
          createArrowPair(p.mainLabel, p.color, p.key);
        }
      });
      purposeGrid.appendChild(b);
    });
  }
  buildPurposeGrid();

  otherOk.addEventListener('click', ()=>{
    const v = otherInput.value.trim();
    if(v){ createArrowPair(v, PURPOSES.find(p=>p.custom).color, 'other'); }
  });
  otherCancel.addEventListener('click', ()=>{ otherInputWrap.style.display = 'none'; });
  otherInput.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') otherOk.click(); });

  function render(){
    renderNodes();
    renderArrows();
    renderHint();
    statCount.textContent = state.arrows.length / 2;
    checkAchievements();
  }

  function renderNodes(){
    canvas.querySelectorAll('.okane-node').forEach(el=>el.remove());
    state.nodes.forEach(node=>{
      const el = document.createElement('div');
      el.className = 'okane-node' + (node.type==='custom' ? ' okane-custom' : '');
      el.dataset.id = node.id;
      el.style.left = node.x + '%';
      el.style.top = node.y + '%';
      const grad = `radial-gradient(circle at 32% 28%, ${lighten(node.color,0.35)} 0%, ${node.color} 72%)`;
      el.innerHTML = `
        <div class="okane-node-circle" style="background:${grad}">${node.icon}
          <div class="okane-node-edit" title="なまえを変える">✏\u{FE0F}</div>
          ${node.type==='custom' ? '<div class="okane-node-del" title="削除">×</div>' : ''}
        </div>
        <div class="okane-node-label">${escapeHtml(node.label)}</div>
      `;
      if(state.selectedSource === node.id) el.classList.add('okane-selected');
      canvas.appendChild(el);
      attachNodeEvents(el, node);
    });
  }

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }

  function attachNodeEvents(el, node){
    let startX=0, startY=0, startNodeX=0, startNodeY=0, moved=false, pointerId=null;

    el.addEventListener('pointerdown', (e)=>{
      if(e.target.classList.contains('okane-node-del') || e.target.classList.contains('okane-node-edit')) return;
      pointerId = e.pointerId;
      el.setPointerCapture(pointerId);
      startX = e.clientX; startY = e.clientY;
      startNodeX = node.x; startNodeY = node.y;
      moved = false;
      el.classList.add('okane-dragging');
    });

    el.addEventListener('pointermove', (e)=>{
      if(pointerId === null || e.pointerId !== pointerId) return;
      const rect = canvas.getBoundingClientRect();
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if(Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
      if(moved){
        let nx = startNodeX + (dx / rect.width) * 100;
        let ny = startNodeY + (dy / rect.height) * 100;
        nx = Math.max(4, Math.min(96, nx));
        ny = Math.max(6, Math.min(94, ny));
        node.x = nx; node.y = ny;
        el.style.left = nx + '%';
        el.style.top = ny + '%';
        renderArrows();
      }
    });

    el.addEventListener('pointerup', (e)=>{
      if(pointerId === null || e.pointerId !== pointerId) return;
      el.releasePointerCapture(pointerId);
      el.classList.remove('okane-dragging');
      pointerId = null;
      if(!moved){ handleNodeTap(node.id); } else { saveState(); }
    });

    const delBtn = el.querySelector('.okane-node-del');
    if(delBtn){
      delBtn.addEventListener('pointerdown', (e)=> e.stopPropagation());
      delBtn.addEventListener('click', (e)=>{ e.stopPropagation(); deleteNode(node.id); });
    }
    const editBtn = el.querySelector('.okane-node-edit');
    if(editBtn){
      editBtn.addEventListener('pointerdown', (e)=> e.stopPropagation());
      editBtn.addEventListener('click', (e)=>{ e.stopPropagation(); openRename(node.id); });
    }
    el.addEventListener('dblclick', ()=>{ if(state.connectMode) return; openRename(node.id); });
  }

  function nodeById(id){ return state.nodes.find(n=>n.id===id); }
  function arrowById(id){ return state.arrows.find(a=>a.id===id); }

  function renderArrows(){
    svgGroup.innerHTML = '';
    state.arrows.forEach(arrow=>{
      const geo = computeArrowGeometry(arrow);
      if(!geo) return;
      drawArrowSVG(arrow, geo);
    });
  }

  function computeArrowGeometry(arrow){
    const from = nodeById(arrow.from);
    const to = nodeById(arrow.to);
    if(!from || !to) return null;
    const p0 = {x: from.x/100*1000, y: from.y/100*650};
    const p2 = {x: to.x/100*1000, y: to.y/100*650};
    const sign = arrow.from < arrow.to ? 1 : -1;
    const sameDir = state.arrows.filter(a=>a.from===arrow.from && a.to===arrow.to);
    const idx = sameDir.indexOf(arrow);
    const magnitude = 65 + idx*48;
    const offset = sign * magnitude;
    const dx = p2.x - p0.x, dy = p2.y - p0.y;
    const len = Math.sqrt(dx*dx+dy*dy) || 1;
    const px = -dy/len, py = dx/len;
    const mid = {x:(p0.x+p2.x)/2 + px*offset, y:(p0.y+p2.y)/2 + py*offset};
    const shrink = 42;
    const s0 = shrinkPoint(p0, mid, shrink);
    const s2 = shrinkPoint(p2, mid, shrink);
    const lp = { x: 0.25*s0.x + 0.5*mid.x + 0.25*s2.x, y: 0.25*s0.y + 0.5*mid.y + 0.25*s2.y };
    return {s0, mid, s2, labelPos:lp};
  }

  function ensureMarker(color){
    const id = 'okane-arrow-marker-' + color.replace('#','');
    if(!root.querySelector('#'+id)){
      const marker = document.createElementNS(SVG_NS,'marker');
      marker.setAttribute('id', id);
      marker.setAttribute('markerWidth','10');
      marker.setAttribute('markerHeight','10');
      marker.setAttribute('refX','8');
      marker.setAttribute('refY','5');
      marker.setAttribute('orient','auto');
      marker.setAttribute('markerUnits','userSpaceOnUse');
      const path = document.createElementNS(SVG_NS,'path');
      path.setAttribute('d','M0,0 L10,5 L0,10 Z');
      path.setAttribute('fill', color);
      marker.appendChild(path);
      svgDefs.appendChild(marker);
    }
    return id;
  }

  let arrowClickTimer = null;

  function drawArrowSVG(arrow, geo){
    const {s0, mid, s2, labelPos} = geo;
    const markerId = ensureMarker(arrow.color);
    const path = document.createElementNS(SVG_NS,'path');
    const d = `M ${s0.x},${s0.y} Q ${mid.x},${mid.y} ${s2.x},${s2.y}`;
    path.setAttribute('d', d);
    path.setAttribute('fill','none');
    path.setAttribute('stroke', arrow.color);
    path.setAttribute('stroke-width', arrow.style==='solid' ? 5 : 4);
    if(arrow.style==='dashed') path.setAttribute('stroke-dasharray','9,7');
    path.setAttribute('marker-end', `url(#${markerId})`);
    path.setAttribute('stroke-linecap','round');
    svgGroup.appendChild(path);

    const isDashed = arrow.style === 'dashed';
    const hit = document.createElementNS(SVG_NS,'path');
    hit.setAttribute('d', d);
    hit.setAttribute('fill','none');
    hit.setAttribute('stroke','transparent');
    hit.setAttribute('stroke-width', 18);
    hit.classList.add('okane-arrow-hitline');
    if(isDashed) hit.classList.add('okane-editable');
    hit.style.pointerEvents = 'stroke';
    if(isDashed){
      hit.addEventListener('click', ()=>{
        clearTimeout(arrowClickTimer);
        arrowClickTimer = setTimeout(()=> openArrowLabelEdit(arrow.id, false), 260);
      });
    }
    hit.addEventListener('dblclick', ()=>{ clearTimeout(arrowClickTimer); deletePair(arrow.pairId); });
    svgGroup.appendChild(hit);

    if(!isDashed) return;

    const text = document.createElementNS(SVG_NS,'text');
    text.setAttribute('x', labelPos.x);
    text.setAttribute('y', labelPos.y);
    text.setAttribute('text-anchor','middle');
    const isBlank = !arrow.label;
    text.setAttribute('class', 'okane-arrow-label' + (isBlank ? ' okane-blank' : ''));
    text.setAttribute('fill', isBlank ? '#8a8a8a' : darken(arrow.color));
    text.textContent = isBlank ? '✏\u{FE0F} ？' : arrow.label;
    svgGroup.appendChild(text);
  }

  function shrinkPoint(p, towards, dist){
    const dx = towards.x - p.x, dy = towards.y - p.y;
    const len = Math.sqrt(dx*dx+dy*dy) || 1;
    const r = Math.min(dist, len*0.4);
    return {x: p.x + dx/len*r, y: p.y + dy/len*r};
  }

  function handleNodeTap(nodeId){
    if(!state.connectMode) return;
    if(state.selectedSource === null){
      state.selectedSource = nodeId;
      render();
    } else if(state.selectedSource === nodeId){
      state.selectedSource = null;
      render();
    } else {
      pendingTarget = {from: state.selectedSource, to: nodeId};
      openPurposeModal(pendingTarget);
    }
  }

  function openPurposeModal(pair){
    const fromNode = nodeById(pair.from);
    const toNode = nodeById(pair.to);
    purposeHint.textContent = `「${fromNode.label}」 → 「${toNode.label}」 の流れ。なにをする？`;
    otherInputWrap.style.display = 'none';
    purposeOverlay.classList.add('okane-show');
  }

  function createArrowPair(mainLabel, color, purposeKey){
    const {from, to} = pendingTarget;
    const pairId = 'p' + (state.idSeq++);
    state.stats.pairsCreated++;
    const revColor = lighten(color, 0.55);
    const mainArrowId = 'a'+(state.idSeq++);
    const revArrowId = 'a'+(state.idSeq++);
    state.arrows.push({id:mainArrowId, pairId, purposeKey, from, to, style:'solid', color, label:mainLabel});
    state.arrows.push({id:revArrowId, pairId, purposeKey, from:to, to:from, style:'dashed', color:revColor, label:''});
    purposeOverlay.classList.remove('okane-show');
    otherInputWrap.style.display = 'none';
    state.selectedSource = null;
    pendingTarget = null;
    render();
    saveState();
    showToast('つながった！ \u{1F389}');
    openArrowLabelEdit(revArrowId, true);
  }

  function deletePair(pairId){
    state.arrows = state.arrows.filter(a=>a.pairId !== pairId);
    render();
    saveState();
  }

  function deleteNode(nodeId){
    state.nodes = state.nodes.filter(n=>n.id !== nodeId);
    state.arrows = state.arrows.filter(a=>a.from!==nodeId && a.to!==nodeId);
    if(state.selectedSource === nodeId) state.selectedSource = null;
    render();
    saveState();
  }

  function renderHint(){
    if(!state.connectMode){ hintBanner.classList.remove('okane-show'); return; }
    hintBanner.classList.add('okane-show');
    if(state.selectedSource){
      const n = nodeById(state.selectedSource);
      hintBanner.textContent = `「${n ? n.label : ''}」を選んだよ。つぎに、つなぎたい相手をタップ！`;
    } else {
      hintBanner.textContent = 'つなぎたいアイテムを2つ、じゅんばんにタップしてね';
    }
  }

  function addCustomNode(icon, label){
    state.customCount++;
    state.stats.itemsAdded++;
    const n = state.customCount;
    const color = NODE_PALETTE[(n-1) % NODE_PALETTE.length];
    const x = 25 + ((n*17) % 55);
    const y = 15 + ((n*29) % 65);
    const id = 'custom' + (state.idSeq++);
    state.nodes.push({id, type:'custom', icon, label, x, y, color});
    render();
    saveState();
  }

  function openRename(nodeId){
    const n = nodeById(nodeId);
    if(!n) return;
    renameTargetId = nodeId;
    renameInput.value = n.label;
    renameOverlay.classList.add('okane-show');
    setTimeout(()=>{ renameInput.focus(); renameInput.select(); }, 50);
  }
  function closeRenameModal(){ renameOverlay.classList.remove('okane-show'); renameTargetId = null; }
  function confirmRename(){
    const n = nodeById(renameTargetId);
    const v = renameInput.value.trim();
    if(n && v){ n.label = v; state.stats.renamed++; render(); saveState(); }
    closeRenameModal();
  }
  closeRename.addEventListener('click', closeRenameModal);
  renameCancel.addEventListener('click', closeRenameModal);
  renameOk.addEventListener('click', confirmRename);
  renameOverlay.addEventListener('click', (e)=>{ if(e.target===renameOverlay) closeRenameModal(); });
  renameInput.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter') confirmRename();
    if(e.key === 'Escape') closeRenameModal();
  });

  function openArrowLabelEdit(arrowId, isNew){
    const a = arrowById(arrowId);
    if(!a) return;
    arrowLabelTargetId = arrowId;
    const fromNode = nodeById(a.from);
    const toNode = nodeById(a.to);
    arrowLabelTitle.childNodes[0].textContent = isNew ? '何が返ってくる？ ' : 'ラベルを変える ';
    arrowLabelHint.textContent = isNew
      ? `「${toNode ? toNode.label : ''}」から「${fromNode ? fromNode.label : ''}」へのお返しは何かな？じぶんで書いてみよう！`
      : `「${fromNode ? fromNode.label : ''}」→「${toNode ? toNode.label : ''}」のラベル`;
    arrowLabelInput.value = a.label || '';
    arrowLabelOverlay.classList.add('okane-show');
    setTimeout(()=>{ arrowLabelInput.focus(); arrowLabelInput.select(); }, 50);
  }
  function closeArrowLabelModal(){ arrowLabelOverlay.classList.remove('okane-show'); arrowLabelTargetId = null; }
  function confirmArrowLabel(){
    const a = arrowById(arrowLabelTargetId);
    const v = arrowLabelInput.value.trim();
    if(a && v){ a.label = v; render(); saveState(); }
    closeArrowLabelModal();
  }
  closeArrowLabel.addEventListener('click', closeArrowLabelModal);
  arrowLabelCancel.addEventListener('click', closeArrowLabelModal);
  arrowLabelOk.addEventListener('click', confirmArrowLabel);
  arrowLabelOverlay.addEventListener('click', (e)=>{ if(e.target===arrowLabelOverlay) closeArrowLabelModal(); });
  arrowLabelInput.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter') confirmArrowLabel();
    if(e.key === 'Escape') closeArrowLabelModal();
  });

  btnAdd.addEventListener('click', ()=> addOverlay.classList.add('okane-show'));
  closeAdd.addEventListener('click', ()=> addOverlay.classList.remove('okane-show'));
  addOverlay.addEventListener('click', (e)=>{ if(e.target===addOverlay) addOverlay.classList.remove('okane-show'); });

  closePurpose.addEventListener('click', ()=>{
    purposeOverlay.classList.remove('okane-show');
    otherInputWrap.style.display = 'none';
    pendingTarget = null;
  });
  purposeOverlay.addEventListener('click', (e)=>{
    if(e.target===purposeOverlay){
      purposeOverlay.classList.remove('okane-show');
      otherInputWrap.style.display = 'none';
      pendingTarget = null;
    }
  });

  btnConnect.addEventListener('click', ()=>{
    state.connectMode = !state.connectMode;
    state.selectedSource = null;
    btnConnect.classList.toggle('okane-active', state.connectMode);
    render();
  });

  btnReset.addEventListener('click', ()=>{
    if(confirm('さいしょの状態にもどしますか？（今までのつくった流れは消えます。もくひょうのバッジは消えません）')){
      const keepAchievements = state.achievements;
      const keepStats = state.stats;
      state = initialState();
      state.achievements = keepAchievements;
      state.stats = keepStats;
      btnConnect.classList.remove('okane-active');
      render();
      saveState();
      showToast('さいしょの状態にもどしました');
    }
  });

  btnSave.addEventListener('click', ()=>{
    state.stats.saved++;
    saveState();
    render();
    showToast('ほぞんしました！ \u{1F4BE}');
  });

  btnExport.addEventListener('click', exportImage);

  function exportImage(){
    const SCALE = 2;
    const W = 1000 * SCALE, H = 650 * SCALE;
    const off = document.createElement('canvas');
    off.width = W; off.height = H;
    const ctx = off.getContext('2d');
    ctx.scale(SCALE, SCALE);
    const grad = ctx.createLinearGradient(0,0,0,650);
    grad.addColorStop(0,'#bfe9ff');
    grad.addColorStop(1,'#d7f8e0');
    ctx.fillStyle = grad;
    roundRect(ctx, 0, 0, 1000, 650, 24);
    ctx.fill();
    ctx.fillStyle = '#1d5b8a';
    ctx.font = "bold 26px 'M PLUS Rounded 1c', sans-serif";
    ctx.textBaseline = 'top';
    ctx.fillText('\u{1F4B0} おかねの流れマップ', 20, 16);
    ctx.font = "13px 'M PLUS Rounded 1c', sans-serif";
    ctx.fillStyle = '#3a6a8a';
    const dateStr = new Date().toLocaleDateString('ja-JP');
    ctx.textAlign = 'right';
    ctx.fillText(dateStr, 980, 22);
    ctx.textAlign = 'left';
    state.arrows.forEach(arrow=>{
      const geo = computeArrowGeometry(arrow);
      if(!geo) return;
      drawArrowCanvas(ctx, arrow, geo);
    });
    state.nodes.forEach(node=>{ drawNodeCanvas(ctx, node); });
    off.toBlob(function(blob){
      if(!blob){ showToast('画像の作成に失敗しました'); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'okane-no-nagare-' + Date.now() + '.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(()=>URL.revokeObjectURL(url), 2000);
      state.stats.exported++;
      saveState();
      render();
      showToast('画像を保存しました \u{1F5BC}\u{FE0F}');
    }, 'image/png');
  }

  function roundRect(ctx, x, y, w, h, r){
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);
    ctx.arcTo(x,y,x+w,y,r);
    ctx.closePath();
  }

  function drawArrowCanvas(ctx, arrow, geo){
    const {s0, mid, s2, labelPos} = geo;
    ctx.save();
    ctx.strokeStyle = arrow.color;
    ctx.lineWidth = arrow.style==='solid' ? 5 : 4;
    ctx.lineCap = 'round';
    ctx.setLineDash(arrow.style==='dashed' ? [9,7] : []);
    ctx.beginPath();
    ctx.moveTo(s0.x, s0.y);
    ctx.quadraticCurveTo(mid.x, mid.y, s2.x, s2.y);
    ctx.stroke();
    ctx.setLineDash([]);
    const tdx = s2.x - mid.x, tdy = s2.y - mid.y;
    const tlen = Math.sqrt(tdx*tdx+tdy*tdy) || 1;
    const ux = tdx/tlen, uy = tdy/tlen;
    const ah = 11;
    const leftPt = {x: s2.x - ux*ah - uy*ah*0.6, y: s2.y - uy*ah + ux*ah*0.6};
    const rightPt = {x: s2.x - ux*ah + uy*ah*0.6, y: s2.y - uy*ah - ux*ah*0.6};
    ctx.fillStyle = arrow.color;
    ctx.beginPath();
    ctx.moveTo(s2.x, s2.y);
    ctx.lineTo(leftPt.x, leftPt.y);
    ctx.lineTo(rightPt.x, rightPt.y);
    ctx.closePath();
    ctx.fill();
    if(arrow.style === 'dashed'){
      const isBlank = !arrow.label;
      const label = isBlank ? '✏\u{FE0F} ？' : arrow.label;
      ctx.font = "bold 13px 'M PLUS Rounded 1c', sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#ffffff';
      ctx.strokeText(label, labelPos.x, labelPos.y);
      ctx.fillStyle = isBlank ? '#8a8a8a' : darken(arrow.color);
      ctx.fillText(label, labelPos.x, labelPos.y);
    }
    ctx.restore();
  }

  function drawNodeCanvas(ctx, node){
    const x = node.x/100*1000, y = node.y/100*650;
    const r = 40;
    ctx.save();
    const grad = ctx.createRadialGradient(x-13,y-14,4, x,y,r);
    grad.addColorStop(0, lighten(node.color,0.35));
    grad.addColorStop(1, node.color);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2);
    ctx.fillStyle = grad;
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.font = '34px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.icon, x, y+1);
    ctx.font = "bold 13px 'M PLUS Rounded 1c', sans-serif";
    const label = node.label;
    const padX = 10;
    const textW = ctx.measureText(label).width;
    const chipW = Math.min(textW + padX*2, 160);
    const chipH = 22;
    const chipX = x - chipW/2;
    const chipY = y + r + 8;
    ctx.fillStyle = '#ffffffee';
    roundRect(ctx, chipX, chipY, chipW, chipH, 10);
    ctx.fill();
    ctx.fillStyle = '#3a3a3a';
    ctx.save();
    ctx.beginPath();
    roundRect(ctx, chipX, chipY, chipW, chipH, 10);
    ctx.clip();
    ctx.fillText(label, x, chipY + chipH/2 + 1, chipW - 4);
    ctx.restore();
    ctx.restore();
  }

  const saved = loadSavedState();
  if(saved){
    state = initialState();
    state.nodes = saved.nodes;
    state.arrows = saved.arrows;
    state.customCount = saved.customCount || 0;
    state.idSeq = saved.idSeq || 1;
    state.connectMode = false;
    state.selectedSource = null;
    state.achievements = Object.assign(defaultAchievements(), saved.achievements || {});
    state.stats = Object.assign({pairsCreated:0, itemsAdded:0, renamed:0, saved:0, exported:0}, saved.stats || {});
  } else {
    state = initialState();
    saveState();
  }
  render();

  // ================= 追加: わたし・会社・国・金融機関 つながりマップ（第2〜4回拡張） =================
  (function initInsightMap(){

    const INSIGHT_KEY = 'moneyFlowSimulator_insight_v1';

    const NODE_DATA = {
      company: {
        id:'company', title:'会社（ビジネス）', icon:'\u{1F3E2}', color:'#ff6b7d',
        keyPoints:[
          {title:'利益の公式', content:'営業利益＝粗利益（売上高－売上原価）－経費'},
          {title:'利益率', content:'原価が低いほど利益率は高くなる（例：アプリは複製コストがほぼゼロ）'},
          {title:'9つのビジネスモデル', content:'モノを売る系（製造販売・流通小売・合算）／長くおつきあい系（継続・フリーミアム・設置ベース）／つなげる系（広告・マッチング・補完財プラットフォーム）'}
        ],
        connections:[
          'コンビニでお菓子を買う → お店（会社）にお金を払っている',
          'YouTubeを無料で見ている → 広告モデルの会社にお世話になっている',
          'ゲームに課金する → フリーミアムモデルの会社に払っている',
          'スーパーで買い物する → 流通小売モデルのお世話になっている'
        ],
        newsQuestion:{
          question:'最近、お店で「値上げ」のニュースをよく見るね。ある会社は、材料の小麦粉が高くなったのに、パンの値段を上げませんでした。この会社の「利益」はどうなると思う？',
          hint:'公式を思い出そう：営業利益＝売上高－売上原価－経費',
          answers:[
            {text:'A. 利益が増える', correct:false, explain:'売上原価（材料費）が上がっているので、利益は減るはずだよ'},
            {text:'B. 利益が減る', correct:true, explain:'正解！値段を変えずに材料費だけ上がると、利益は減ってしまうんだ'},
            {text:'C. 利益は変わらない', correct:false, explain:'材料費が上がったのに値段が変わらないと、利益は減ってしまうよ'}
          ]
        },
        freeInputPlaceholder:'例：好きな会社はどのビジネスモデル？／なぜ値上げしない会社があるの？'
      },
      country: {
        id:'country', title:'国（税金）', icon:'\u{1F3DB}\u{FE0F}', color:'#42a5f5',
        keyPoints:[
          {title:'国のサイフの大きさ', content:'約115兆円（毎年）'},
          {title:'集め方の内訳', content:'消費税21%、所得税18%、法人税15%、その他税15%、借金（国債）31%'},
          {title:'使い方の内訳', content:'社会保障33%、借金返済24%、地方交付金16%、防衛8%、公共事業5%、教育・科学5%'},
          {title:'3本足のイス理論', content:'1つの税に頼りすぎると倒れる。みんなで少しずつ痛みを分け合う'}
        ],
        connections:[
          'コンビニで買い物 → 消費税10%を国に払っている',
          '公立学校に通う → 税金で運営されている',
          '病院で治療を受ける → 社会保障（税金）で医療費が安くなっている',
          '道路・信号・公園を使う → 全部税金でできている'
        ],
        newsQuestion:{
          question:'日本は、税金だけでは足りず、毎年たくさんの「借金（国債）」をしています。この借金は、将来誰が返すことになるでしょう？',
          hint:'借金は「今すぐ」ではなく、時間をかけて返していくもの。将来お金を稼いで税金を払う人は誰かな？',
          answers:[
            {text:'A. 今の大人だけ', correct:false, explain:'今の借金は数十年かけて返すから、今の大人だけでは返しきれないんだ'},
            {text:'B. 将来大人になる、今の子どもたち', correct:true, explain:'正解！だから借金は「未来からの前借り」とも言われる。真剣に考える必要があるね'},
            {text:'C. 外国の人が返してくれる', correct:false, explain:'国の借金は、その国の人たちが返すしかないんだ'}
          ]
        },
        freeInputPlaceholder:'例：もし自分が財務大臣なら何にお金を使う？／他の国の税金はどうなってる？'
      },
      bank: {
        id:'bank', title:'金融機関（銀行・日銀）', icon:'\u{1F3E6}', color:'#26a69a',
        keyPoints:[
          {title:'日銀の2つの道具', content:'政策金利（微調整・±2℃）と国債オペ（主力技・±5℃）'},
          {title:'政策が届く順番', content:'日銀 → 銀行 → 家計・企業 → お店 → 物価'},
          {title:'トレードオフ', content:'どの政策にも、得する人と困る人の両方がいる（利下げ→借りる人が喜ぶ、貯金派は困る）'},
          {title:'大原則', content:'「急ハンドルは事故のもと」「見て見ぬふりも良くない」'}
        ],
        connections:[
          'お小遣いを銀行に預ける → 銀行がそのお金を会社に貸している',
          '家族が住宅ローンを組む → 金利が低いと返す金額が少なくて済む',
          'お札を見る → 日本銀行が発行している（お札に「日本銀行券」と書いてある）',
          '円安・円高のニュース → 日銀の金融政策が関係している'
        ],
        newsQuestion:{
          question:'日銀が「政策金利を上げる」と決めたとき、住宅ローンを組んでいるA家族と、貯金だけで生活しているBおじいちゃん、どちらが喜ぶでしょう？',
          hint:'金利が上がると、借りたお金の利子は増える。預けたお金の利子も増える。',
          answers:[
            {text:'A. A家族（住宅ローン）', correct:false, explain:'金利が上がると、ローンの利子も増えるので、A家族は返す金額が増えて困るよ'},
            {text:'B. Bおじいちゃん（貯金派）', correct:true, explain:'正解！金利が上がると預金の利子も増えるので、貯金派は喜ぶ。逆に借りている人は困るんだ'},
            {text:'C. 両方喜ぶ', correct:false, explain:'金利は「借りる人」と「預ける人」で立場が真逆になるから、両方が喜ぶことは少ないよ'}
          ]
        },
        freeInputPlaceholder:'例：円安と円高、どっちがいいの？／最近日銀は何をした？'
      }
    };

    const RELATION_POS = {
      self:{x:50,y:52}, country:{x:50,y:13}, company:{x:85,y:52}, bank:{x:15,y:52}
    };

    const RELATIONS = [
      {id:'self-company', a:'self', b:'company', color:'#ff6b7d', labelAB:'お金を払う', labelBA:'商品・サービスをもらう'},
      {id:'self-country', a:'self', b:'country', color:'#42a5f5', labelAB:'税金を払う', labelBA:'学校・道路・医療などのサービス'},
      {id:'self-bank',    a:'self', b:'bank',    color:'#26a69a', labelAB:'お金を預ける／借りる', labelBA:'利子・ローン'},
      {id:'company-country', a:'company', b:'country', color:'#ab47bc', labelAB:'法人税を払う', labelBA:'インフラ・治安を提供'},
      {id:'company-bank',    a:'company', b:'bank',    color:'#8e7cff', labelAB:'お金を借りる／預ける', labelBA:'利子・融資'},
      {id:'country-bank',    a:'country', b:'bank',    color:'#ffb74d', labelAB:'国債を発行', labelBA:'日銀が国債を買う（金融政策）'}
    ];

    const NODE_LABELS = {self:'わたし', company:'会社', country:'国（税金）', bank:'金融機関'};
    const NODE_ICONS = {self:'\u{1F9D2}', company:'\u{1F3E2}', country:'\u{1F3DB}\u{FE0F}', bank:'\u{1F3E6}'};

    function defaultInsight(){
      return { freeText:{company:'',country:'',bank:''}, quiz:{company:null,country:null,bank:null} };
    }
    function loadInsight(){
      const base = defaultInsight();
      try{
        const raw = localStorage.getItem(INSIGHT_KEY);
        if(!raw) return base;
        const data = JSON.parse(raw);
        if(data && typeof data === 'object'){
          base.freeText = Object.assign(base.freeText, data.freeText||{});
          base.quiz = Object.assign(base.quiz, data.quiz||{});
        }
      }catch(e){ /* storage unavailable - ignore */ }
      return base;
    }
    function saveInsight(){
      try{ localStorage.setItem(INSIGHT_KEY, JSON.stringify(insightState)); }catch(e){ /* ignore */ }
    }
    let insightState = loadInsight();

    // ---------- relation diagram ----------
    const relationWrap = $('okaneRelationWrap');
    const relationMobileList = $('okaneRelationMobileList');

    function buildRelationArrows(groupEl){
      if(!groupEl) return;
      groupEl.innerHTML = '';
      RELATIONS.forEach(rel=>{
        const p0 = RELATION_POS[rel.a], p1 = RELATION_POS[rel.b];
        const mx = (p0.x+p1.x)/2, my = (p0.y+p1.y)/2;
        const dx = p1.x-p0.x, dy = p1.y-p0.y;
        const len = Math.sqrt(dx*dx+dy*dy)||1;
        const px = -dy/len, py = dx/len;
        const bend = 6;
        const cx = mx + px*bend, cy = my + py*bend;
        const d = `M ${p0.x},${p0.y} Q ${cx},${cy} ${p1.x},${p1.y}`;
        const path = document.createElementNS(SVG_NS,'path');
        path.setAttribute('d', d);
        path.setAttribute('stroke', rel.color);
        path.setAttribute('class','okane-rel-arrow');
        path.dataset.a = rel.a; path.dataset.b = rel.b;
        groupEl.appendChild(path);
        const flow = document.createElementNS(SVG_NS,'path');
        flow.setAttribute('d', d);
        flow.setAttribute('class','okane-rel-arrow-flow');
        flow.dataset.a = rel.a; flow.dataset.b = rel.b;
        groupEl.appendChild(flow);
      });
    }
    buildRelationArrows(root.querySelector('#okaneRelationArrowGroup'));
    buildRelationArrows(root.querySelector('#okanePresentArrowGroup'));

    function setRelationHighlight(nodeKey, on){
      root.querySelectorAll('.okane-rel-arrow, .okane-rel-arrow-flow').forEach(p=>{
        if(p.dataset.a === nodeKey || p.dataset.b === nodeKey){
          p.classList.toggle('okane-rel-arrow-active', on);
        }
      });
    }

    relationWrap.querySelectorAll('.okane-relation-node').forEach(el=>{
      const key = el.dataset.node;
      el.addEventListener('mouseenter', ()=>{ setRelationHighlight(key, true); el.classList.add('okane-relation-active'); });
      el.addEventListener('mouseleave', ()=>{ setRelationHighlight(key, false); el.classList.remove('okane-relation-active'); });
      el.addEventListener('click', ()=>{ key === 'self' ? openSelfRecap() : openInsightModal(key); });
    });
    root.querySelectorAll('#okanePresentMap .okane-relation-node').forEach(el=>{
      const key = el.dataset.node;
      el.addEventListener('mouseenter', ()=> setRelationHighlight(key, true));
      el.addEventListener('mouseleave', ()=> setRelationHighlight(key, false));
    });

    function buildMobileList(){
      relationMobileList.innerHTML = '';
      const order = ['self','country','company','bank'];
      order.forEach((key, idx)=>{
        if(idx > 0){
          const prevKey = order[idx-1];
          const rel = RELATIONS.find(r=> (r.a===prevKey&&r.b===key) || (r.a===key&&r.b===prevKey));
          if(rel){
            const conn = document.createElement('div');
            conn.className = 'okane-rel-connector';
            const forward = rel.a === prevKey ? rel.labelAB : rel.labelBA;
            const backward = rel.a === prevKey ? rel.labelBA : rel.labelAB;
            conn.innerHTML = `↓ ${escapeHtml(forward)}<br>↑ ${escapeHtml(backward)}`;
            relationMobileList.appendChild(conn);
          }
        }
        const card = document.createElement('div');
        card.className = 'okane-rel-mobile-card';
        card.innerHTML = `<div class="okane-rel-mobile-emoji">${NODE_ICONS[key]}</div><b>${escapeHtml(NODE_LABELS[key])}</b>`;
        card.addEventListener('click', ()=>{ key==='self' ? openSelfRecap() : openInsightModal(key); });
        relationMobileList.appendChild(card);
      });
      const triTitle = document.createElement('div');
      triTitle.className = 'okane-rel-triangle-title';
      triTitle.textContent = '\u{1F53A} 3者どうしのつながり';
      relationMobileList.appendChild(triTitle);
      RELATIONS.filter(r=> r.a!=='self' && r.b!=='self').forEach(rel=>{
        const conn = document.createElement('div');
        conn.className = 'okane-rel-connector';
        conn.style.marginLeft = '0';
        conn.style.borderLeft = 'none';
        conn.innerHTML = `${NODE_ICONS[rel.a]}${escapeHtml(NODE_LABELS[rel.a])} ⇄ ${NODE_ICONS[rel.b]}${escapeHtml(NODE_LABELS[rel.b])}：${escapeHtml(rel.labelAB)} ／ ${escapeHtml(rel.labelBA)}`;
        relationMobileList.appendChild(conn);
      });
    }
    buildMobileList();

    // ---------- detail modal (company/country/bank) ----------
    const insightOverlay = $('okaneInsightOverlay');
    const insightTitle = $('okaneInsightTitle');
    const insightBody = $('okaneInsightBody');
    const closeInsight = $('okaneCloseInsight');
    const selfOverlay = $('okaneSelfOverlay');
    const selfBody = $('okaneSelfBody');
    const closeSelf = $('okaneCloseSelf');

    function buildDetailHTML(nodeKey){
      const d = NODE_DATA[nodeKey];
      const q = d.newsQuestion;
      const savedQuiz = insightState.quiz[nodeKey];
      let html = '';
      html += '<div class="okane-insight-block"><h3>\u{1F4CC} 覚えておきたい内容</h3>';
      d.keyPoints.forEach(kp=>{
        html += `<div class="okane-keypoint-card"><b>${escapeHtml(kp.title)}</b><span>${escapeHtml(kp.content)}</span></div>`;
      });
      html += '</div>';
      html += '<div class="okane-insight-block"><h3>\u{1F517} 自分との繋がり</h3><ul class="okane-connection-list">';
      d.connections.forEach(c=>{ html += `<li>${escapeHtml(c)}</li>`; });
      html += '</ul></div>';
      html += '<div class="okane-insight-block"><h3>\u{1F4F0} 今どうなっているか？</h3>';
      html += `<div class="okane-quiz-question">${escapeHtml(q.question)}</div>`;
      html += `<div class="okane-quiz-hint">${escapeHtml(q.hint)}</div>`;
      html += `<div class="okane-quiz-opts" data-node="${nodeKey}">`;
      q.answers.forEach((ans, idx)=>{
        const cls = savedQuiz && savedQuiz.selected === idx ? (ans.correct ? ' okane-quiz-correct' : ' okane-quiz-wrong') : '';
        html += `<button type="button" class="okane-quiz-opt${cls}" data-idx="${idx}">${escapeHtml(ans.text)}</button>`;
        html += `<div class="okane-quiz-explain${savedQuiz && savedQuiz.selected===idx ? ' okane-show' : ''}" data-explain="${idx}">${escapeHtml(ans.explain)}</div>`;
      });
      html += '</div></div>';
      html += '<div class="okane-insight-block"><h3>✏\u{FE0F} 気になること・調べたいこと</h3>';
      html += `<textarea class="okane-insight-textarea" data-node="${nodeKey}" placeholder="${escapeHtml(d.freeInputPlaceholder)}">${escapeHtml(insightState.freeText[nodeKey]||'')}</textarea></div>`;
      return html;
    }

    function attachDetailEvents(container, nodeKey){
      const d = NODE_DATA[nodeKey];
      const optsWrap = container.querySelector('.okane-quiz-opts');
      if(optsWrap){
        optsWrap.querySelectorAll('.okane-quiz-opt').forEach(btn=>{
          btn.addEventListener('click', ()=>{
            const idx = parseInt(btn.dataset.idx, 10);
            const ans = d.newsQuestion.answers[idx];
            optsWrap.querySelectorAll('.okane-quiz-opt').forEach(b=> b.classList.remove('okane-quiz-correct','okane-quiz-wrong'));
            optsWrap.querySelectorAll('.okane-quiz-explain').forEach(e=> e.classList.remove('okane-show'));
            btn.classList.add(ans.correct ? 'okane-quiz-correct' : 'okane-quiz-wrong');
            const explain = optsWrap.querySelector(`.okane-quiz-explain[data-explain="${idx}"]`);
            if(explain) explain.classList.add('okane-show');
            insightState.quiz[nodeKey] = {selected: idx, correct: !!ans.correct};
            saveInsight();
            if(ans.correct){ spawnConfetti(container.closest('.okane-modal') || container); showToast('せいかい！\u{1F389}'); }
          });
        });
      }
      const textarea = container.querySelector('.okane-insight-textarea');
      if(textarea){
        textarea.addEventListener('input', ()=>{ insightState.freeText[nodeKey] = textarea.value; });
        textarea.addEventListener('blur', ()=>{ saveInsight(); });
      }
    }

    function openInsightModal(nodeKey){
      const d = NODE_DATA[nodeKey];
      insightTitle.childNodes[0].textContent = `${d.icon} ${d.title} `;
      insightBody.innerHTML = buildDetailHTML(nodeKey);
      attachDetailEvents(insightBody, nodeKey);
      insightOverlay.classList.add('okane-show');
    }
    closeInsight.addEventListener('click', ()=> insightOverlay.classList.remove('okane-show'));
    insightOverlay.addEventListener('click', (e)=>{ if(e.target===insightOverlay) insightOverlay.classList.remove('okane-show'); });

    function openSelfRecap(){
      const pairCount = state.arrows.length / 2;
      let html = `<div class="okane-purpose-hint">きみが作った「じぶんのお金の流れ」は、いま ${pairCount} くみあるよ！</div>`;
      html += '<div class="okane-insight-block"><h3>\u{1F91D} 3つの方向をふりかえろう</h3><ul class="okane-connection-list">';
      RELATIONS.filter(r=>r.a==='self').forEach(r=>{
        html += `<li>${NODE_ICONS[r.b]} ${escapeHtml(NODE_LABELS[r.b])}：${escapeHtml(r.labelAB)} ／ ${escapeHtml(r.labelBA)}</li>`;
      });
      html += '</ul></div>';
      html += '<div class="okane-purpose-hint">上の「おかねの流れシミュレーター」で、じぶんの流れをもう一度みてみよう！</div>';
      selfBody.innerHTML = html;
      selfOverlay.classList.add('okane-show');
    }
    closeSelf.addEventListener('click', ()=> selfOverlay.classList.remove('okane-show'));
    selfOverlay.addEventListener('click', (e)=>{ if(e.target===selfOverlay) selfOverlay.classList.remove('okane-show'); });

    // ---------- confetti ----------
    function spawnConfetti(container){
      if(!container) return;
      const colors = ['#ff5252','#ffca28','#26a69a','#42a5f5','#ab47bc','#8e7cff'];
      if(getComputedStyle(container).position === 'static') container.style.position = 'relative';
      for(let i=0;i<22;i++){
        const piece = document.createElement('div');
        piece.className = 'okane-confetti-piece';
        piece.style.left = (Math.random()*94+2) + '%';
        piece.style.background = colors[i % colors.length];
        piece.style.animationDelay = (Math.random()*0.15) + 's';
        container.appendChild(piece);
        setTimeout(()=>{ piece.remove(); }, 1600);
      }
    }

    // ---------- presentation mode ----------
    const btnPresent = $('okaneBtnPresent');
    const presentOverlay = $('okanePresentOverlay');
    const presentClose = $('okanePresentClose');
    const presentPrev = $('okanePresentPrev');
    const presentNext = $('okanePresentNext');
    const presentDots = $('okanePresentDots');
    const presentSlides = [0,1,2,3,4].map(i=> $('okanePresentSlide'+i));
    const presentSlideKeys = [null,'company','country','bank',null];
    let presentIndex = 0;

    function renderPresentDots(){
      presentDots.innerHTML = '';
      presentSlides.forEach((s, i)=>{
        const dot = document.createElement('div');
        dot.className = 'okane-present-dot' + (i===presentIndex ? ' okane-active' : '');
        presentDots.appendChild(dot);
      });
    }

    function showPresentSlide(i){
      presentIndex = Math.max(0, Math.min(presentSlides.length-1, i));
      const key = presentSlideKeys[presentIndex];
      if(key){
        presentSlides[presentIndex].innerHTML = `<h2>${NODE_DATA[key].icon} ${escapeHtml(NODE_DATA[key].title)}</h2>` + buildDetailHTML(key);
        attachDetailEvents(presentSlides[presentIndex], key);
      }
      presentSlides.forEach((s, idx)=> s.classList.toggle('okane-show', idx===presentIndex));
      presentPrev.style.visibility = presentIndex===0 ? 'hidden' : 'visible';
      presentNext.textContent = presentIndex === presentSlides.length-1 ? 'とじる' : '次へ ＞';
      renderPresentDots();
    }

    btnPresent.addEventListener('click', ()=>{
      presentOverlay.classList.add('okane-show');
      showPresentSlide(0);
    });
    presentClose.addEventListener('click', ()=> presentOverlay.classList.remove('okane-show'));
    presentOverlay.addEventListener('click', (e)=>{ if(e.target===presentOverlay) presentOverlay.classList.remove('okane-show'); });
    presentPrev.addEventListener('click', ()=> showPresentSlide(presentIndex-1));
    presentNext.addEventListener('click', ()=>{
      if(presentIndex === presentSlides.length-1){ presentOverlay.classList.remove('okane-show'); return; }
      showPresentSlide(presentIndex+1);
    });

    // ---------- image export (presentation sheet) ----------
    const btnInsightExport = $('okaneBtnInsightExport');
    btnInsightExport.addEventListener('click', exportInsightSheet);

    function wrapText(ctx, text, x, y, maxWidth, lineHeight){
      const chars = String(text).split('');
      let line = '';
      chars.forEach(ch=>{
        const test = line + ch;
        if(ctx.measureText(test).width > maxWidth && line){
          ctx.fillText(line, x, y);
          line = ch;
          y += lineHeight;
        } else {
          line = test;
        }
      });
      if(line){ ctx.fillText(line, x, y); y += lineHeight; }
      return y;
    }

    function exportInsightSheet(){
      const SCALE = 2;
      const W = 900, H = 1300;
      const off = document.createElement('canvas');
      off.width = W*SCALE; off.height = H*SCALE;
      const ctx = off.getContext('2d');
      ctx.scale(SCALE, SCALE);
      ctx.fillStyle = '#eaf7ff';
      ctx.fillRect(0,0,W,H);
      ctx.fillStyle = '#1d5b8a';
      ctx.font = "bold 26px 'M PLUS Rounded 1c', sans-serif";
      ctx.textBaseline = 'top';
      ctx.fillText('\u{1F4B0} お金のつながり発表シート', 24, 20);
      ctx.font = "12px 'M PLUS Rounded 1c', sans-serif";
      ctx.fillStyle = '#3a6a8a';
      ctx.textAlign = 'right';
      ctx.fillText(new Date().toLocaleDateString('ja-JP'), W-24, 26);
      ctx.textAlign = 'left';

      const mapY = 64, mapH = 250;
      function px(pos){ return {x: 60 + pos.x/100*(W-120), y: mapY + pos.y/100*mapH}; }
      RELATIONS.forEach(rel=>{
        const p0 = px(RELATION_POS[rel.a]), p1 = px(RELATION_POS[rel.b]);
        ctx.strokeStyle = rel.color;
        ctx.lineWidth = 2.4;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.moveTo(p0.x,p0.y); ctx.lineTo(p1.x,p1.y); ctx.stroke();
        ctx.globalAlpha = 1;
      });
      ['self','country','company','bank'].forEach(key=>{
        const p = px(RELATION_POS[key]);
        ctx.beginPath();
        ctx.arc(p.x,p.y,26,0,Math.PI*2);
        ctx.fillStyle = key==='self' ? '#ffd93d' : NODE_DATA[key].color;
        ctx.fill();
        ctx.lineWidth = 3; ctx.strokeStyle = '#fff'; ctx.stroke();
        ctx.font = '22px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(NODE_ICONS[key], p.x, p.y+1);
        ctx.font = "bold 11px 'M PLUS Rounded 1c', sans-serif";
        ctx.fillStyle = '#333';
        ctx.fillText(NODE_LABELS[key], p.x, p.y+40);
      });
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';

      let y = mapY + mapH + 30;
      ['company','country','bank'].forEach(key=>{
        const d = NODE_DATA[key];
        ctx.fillStyle = d.color;
        roundRect(ctx, 24, y, W-48, 6, 3);
        ctx.fill();
        y += 18;
        ctx.font = "bold 18px 'M PLUS Rounded 1c', sans-serif";
        ctx.fillStyle = '#1d5b8a';
        ctx.fillText(`${d.icon} ${d.title}`, 24, y);
        y += 28;
        ctx.font = "13px 'M PLUS Rounded 1c', sans-serif";
        ctx.fillStyle = '#444';
        const note = insightState.freeText[key];
        const noteText = note && note.trim() ? '\u{1F4AD} ' + note : '\u{1F4AD}（まだ書いていません）';
        y = wrapText(ctx, noteText, 24, y, W-48, 18);
        y += 6;
        const quiz = insightState.quiz[key];
        let quizText = '\u{1F4F0}（まだこたえていません）';
        if(quiz){
          const ans = d.newsQuestion.answers[quiz.selected];
          quizText = (quiz.correct ? '\u{2705} せいかい：' : '\u{274C} こたえ：') + (ans ? ans.text : '');
        }
        ctx.fillStyle = quiz && quiz.correct ? '#26a65b' : (quiz ? '#e5384f' : '#888');
        y = wrapText(ctx, quizText, 24, y, W-48, 18);
        y += 22;
      });

      off.toBlob(function(blob){
        if(!blob){ showToast('画像の作成に失敗しました'); return; }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'okane-happyou-sheet-' + Date.now() + '.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(()=>URL.revokeObjectURL(url), 2000);
        showToast('発表シートを保存しました \u{1F5BC}\u{FE0F}');
      }, 'image/png');
    }

  })();

  } // end startApp

  function boot(){
    injectFonts();
    injectStyle();
    injectMarkup();
    startApp();
  }

  // DOM がまだ構築中（head 内で読み込まれた場合や defer/遅延読み込みの場合）でも
  // プレースホルダーが確実に存在してから起動する
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
