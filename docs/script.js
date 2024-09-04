document.getElementById('extractBtn').addEventListener('click', async () => {
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
    extractBtn.disabled = true;  // ボタン無効化
    spinner.style.display = 'inline-block';  // スピナー表示
    status.textContent = 'ロード中...';

    const { createFFmpeg, fetchFile } = FFmpeg;
    const ffmpeg = createFFmpeg({ log: true });

    await ffmpeg.load();
    status.textContent = '処理中...';

    ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(file));
    await ffmpeg.run('-i', 'input.mp4', 'output.mp3');

    const data = ffmpeg.FS('readFile', 'output.mp3');
    const blob = new Blob([data.buffer], { type: 'audio/mp3' });
    const url = URL.createObjectURL(blob);
    
    download.href = url;
    download.download = 'output.mp3';
    download.style.display = 'block';
    download.textContent = 'ここをクリックしてダウンロード';
    status.textContent = '完了';

    extractBtn.disabled = false;  // ボタン有効化
    spinner.style.display = 'none';  // スピナー非表示
});
