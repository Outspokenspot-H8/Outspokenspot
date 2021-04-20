const questions = [
    "Apa sesuatu yang selalu ingin anda katakan kepada saya tetapi tidak bisa?",
    "Apa arti nama anda? Apakah sesuai dengan dirimu saat ini?",
    "Jenis hewan apa yang anda suka dan mengapa?",
    "Apa rahasia yang kamu simpan dari orang tuamu?",
    "Jika anda bisa tidak terlihat, apa hal pertama yang akan anda lakukan?",
    "Kapan terakhir kali anda berbohong?",
    "Jika anda bisa menjadi karakter fiksi dalam sehari, siapa yang akan anda pilih dan mengapa?",
    "Tren paling aneh apa yang pernah anda ikuti?",
    "Jika hari ini anda akan dihukum mati, apa permintaan terakhir anda?",
    "Apa bagian tubuh favoritmu? Kenapa?",
    "Kapan terakhir kali anda menangis? Apa penyebabnya?",
    "Sebutkan tiga benda yang akan anda bawa ke pulau terpencil? Jelaskan kegunaan setiap benda.",
    "Apa penyesalan terbesarmu yang masih ada di kepalamu saat ini?",
    "Sebutkan bagian tubuh anda yang paling membuat anda insecure?",
    "Jika hari ini adalah hari terakhirmu, sebutkan tiga hal yang akan anda lakukan?",
    "Di mana anda melihat diri anda tinggal saat anda pensiun dan jelaskan mengapa demikian?",
    "Berapa jumlah anak yang anda harapkan dan jelaskan alasannya?",
    "Apa alasan yang membuat kamu tetap bangun dari tempat tidur setiap hari dan menjalani hari?",
    "Apa hal yang paling kamu syukuri hingga hari ini?",
    "Apa hal yang tidak penting tapi membanggakan untukmu? (Co: Bisa menjulurkan lidah sampai ke dagu).",
    "Mana yang lebih penting, teman atau pasangan dan jelaskan alasannya?",
    "Jika kamu bisa menyampaikan satu kalimat ke seluruh dunia dan semua orang membacanya, apa isi pesan itu dan mengapa?",
    "Jika kamu bisa memberi saran kepada dirimu 5 tahun lalu, saran apa yang anda berikan?",
    "Ketika anda meninggal, bagaimana anda ingin dikenang?",
    "Ceritakan titik terendah dalam hidup anda dan bagaimana reaksi anda saat itu?",
    "Dalam suatu hubungan, mana yang akan anda pilih, meninggalkan atau ditinggalkan? Alasannya?",
    "Jika kalian bisa kembali ke masa lalu bahkan sampai pertama bumi terbentuk, siapa yang ingin anda temui dan apa yang akan anda lakukan?",
    "Apa sifat yang paling anda sukai dari diri anda? Jelaskan.",
    "Tutup mata anda dan sebutkan hal pertama yang anda lihat dalam pikiran anda?",
    "Jika hidup anda sampai hari ini adalah sebuah novel, apa judul yang tepat untuk novel tersebut?",
    "Apa cita-cita yang ingin anda capai ketika kecil dan mengapa?",
    "Sebutkan apa saja yang membuat anda ingin mengucapkan terima kasih kepada diri anda sendiri?",
    "Apabila hari ini adalah hari terakhir anda, siapa yang akan anda hubungi dan apa yang akan anda katakan?",
    "Kemana uang anda paling banyak dihabiskan dan mengapa?",
    "Apa yang paling membuat anda khawatir tentang masa depan?",
    "Ceritakan kejadian atau hal yang paling aneh yang pernah anda lakukan atau anda alami.",
    "Apa kebiasaan buruk anda yang ingin anda hentikan?",
    "Ceritakan mimpi teraneh yang pernah anda alami.",
    "Sebutkan kutipan terbaik menurut anda dan mengapa?",
    "Hal apa saja yang ingin anda capai di masa depan?",
    "Bagaimana menurutmu tentang pasangan yang berbagi password sosial media? Jelaskan mengapa demikian.",
    "Pelajaran apa yang kamu dapatkan dari hubungan masa lalumu? Ceritkan.",
    "Jika Covid-19 saat ini juga berakhir, apa yang akan anda lakukan?",
    "Ceritakan pengalaman paranormalmu.",
    "Jika seseorang memberi anda uang 150 juta untuk memulai bisnis, bisnis apa yang akan anda buat dan kenapa?",
    "Keahlian apa yang saat ini anda ingin pelajari tetapi belum dimulai? Jelaskan mengapa demikian?",
    "Bagaimana anda menjelaskan hubungan yang toxic?",
    "Bagaimana seseorang sudah bisa dikatakan selingkuh menurut anda?",
    "Apa yang ada dibenak anda ketika pertama kali bertemu saya?",
    "Ceritkan hal yang paling memalukan yang pernah anda alami.",
    "Jika anda terkenal, anda ingin terkenal karena apa? Jelaskan."
]

const getQuestion = document.getElementById('generate-question-btn');

function acak () {
    const h1 = document.querySelector('.banner-content h1');
    let i = 0;
    const mulai = new Date().getTime();

    setInterval(function () {
        if (new Date().getTime() - mulai > 2180) {
            return;
        }
        h1.innerHTML = questions[Math.round(Math.random() * (questions.length - 1))];
        i++;
        if (i === questions.length - 1) {
            i = 0;
        }
    }, 5);
}

const soundEffect = document.getElementById('sound-effect')

getQuestion.addEventListener('click', function() {
    let index = 0;
    
    if (questions.length > 1) {
        soundEffect.play()
        
        acak()
    }

    setTimeout(function () {
        const question = document.querySelector('.banner-content h1');
        question.innerHTML = questions[Math.round(Math.random() * (questions.length - 1))];
        // console.log(question.innerHTML);
        index = questions.indexOf(question.innerHTML);
        // console.log(index);
        // console.log(questions, 'sebelum');
        questions.splice(index, 1)
        // console.log(questions, 'sesudah');
        if (questions.length <= 0) {
            question.innerHTML = 'Kamu telah menyelesaikan semua pertanyaan, thank you for playing!';
            questions.push(question.innerHTML);
            return;
        }
    }, 2180);

})