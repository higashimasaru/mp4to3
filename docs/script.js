document.getElementById('extractBtn').addEventListener('click', () => {
    const upload = document.getElementById('upload');
    const extractBtn = document.getElementById('extractBtn');
    const spinner = document.getElementById('spinner');
    const status = document.getElementById('status');
    const download = document.getElementById('download');

    if (!upload.files.length) {
        alert('ファイルを選択してください');
        return;
    }

    const file = upload.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
        const arrayBuffer = e.target.result;

        // FFmpeg の設定
        const ffmpeg = await FFmpeg.createFFmpeg({
            corePath: "https://cdn.jsdelivr.net/npm/ffmpeg.js/ffmpeg-mp4-core.js",
            log: true,
        });

        await ffmpeg.load();
        
        const uint8Array = new Uint8Array(arrayBuffer);
        ffmpeg.FS('writeFile', 'input.mp4', uint8Array);

        spinner.style.display = 'inline-block'; // スピナー表示
        status.textContent = '処理中...';

        await ffmpeg.run('-i', 'input.mp4', 'output.mp3');

        const output = ffmpeg.FS('readFile', 'output.mp3');
        const blob = new Blob([output.buffer], { type: 'audio/mp3' });
        const url = URL.createObjectURL(blob);

        spinner.style.display = 'none'; // スピナー非表示
        status.textContent = '完了';

        download.href = url;
        download.download = 'output.mp3';
        download.style.display = 'block';
        download.textContent = 'ここをクリックしてダウンロード';

        extractBtn.disabled = false;  // ボタン有効化
    };

    reader.readAsArrayBuffer(file);
});
