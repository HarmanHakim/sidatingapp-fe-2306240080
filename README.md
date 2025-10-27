*Pertanyaan 1*
*Perhatikan apa yang terjadi pada file index.vue pada branch feat/tutorial-6. Apa yang terjadi setelah git cherry-pick dilakukan? Apakah kita bisa melakukan cherry-pick tanpa harus melakukan commit?*

*Jawab*
Setelah perintah `git cherry-pick <id commit>` dieksekusi pada branch `feat/tutorial-6`, Git mengambil perubahan dari *commit* spesifik tersebut (yang dalam kasus ini adalah penambahan baris kode baru) dan langsung menerapkannya ke file `index.vue` di branch saat ini. Proses ini secara *default* otomatis membuat sebuah *commit* baru, yang dalam contoh ini memiliki pesan "tutorial 6 : add head", untuk mencatat perubahan yang baru saja diterapkan. Namun, menjawab pertanyaan kedua, kita sebenarnya bisa melakukan *cherry-pick* tanpa langsung membuat *commit* dengan menggunakan opsi `--no-commit` atau `-n`. Jika opsi ini digunakan, Git hanya akan menerapkan perubahan pada file di *working directory* (seperti `index.vue`), sehingga memberi kita kesempatan untuk memodifikasi atau meninjau ulang file tersebut sebelum akhirnya melakukan *commit* secara manual.

*Resource*: https://www.atlassian.com/git/tutorials/cherry-pick



*Pertanyaan 2*
*Apa yang menjadi penyebab dari konflik tersebut?*

*Jawab*
Konflik pada kasus ini terjadi karena Git mendeteksi adanya perbedaan konten pada file yang sama antara branch feat/tutorial6 dan tutorial6-for-merge. Ketika proses penggabungan (merge) diinisiasi, sistem menemukan bahwa bagian kode yang identik telah dimodifikasi secara berbeda di kedua branch tersebut. Git tidak dapat secara otomatis menentukan versi mana yang benar untuk dipertahankan, sehingga proses merge dihentikan dan konflik pun terjadi. Untuk mengatasinya, developer harus melakukan intervensi manual untuk mengedit file, memilih atau menggabungkan kode yang diinginkan. Setelah perbaikan selesai, file tersebut harus ditandai sebagai "telah diselesaikan" menggunakan git add, dan kemudian proses penggabungan dapat dilanjutkan hingga selesai dengan menjalankan perintah git merge --continue.

*Resource*: https://www.atlassian.com/git/tutorials/using-branches/merge-conflicts



*Pertanyaan 3*
*Jelaskan perbedaan dari "rebase –continue", "rebase –skip", dan "rebase –abort"!*

*Jawab*
git rebase --continue: Opsi ini dijalankan setelah kita berhasil menyelesaikan konflik penggabungan secara manual. Ini memberitahu Git bahwa konflik telah diatasi dan proses rebase bisa dilanjutkan ke commit berikutnya.

git rebase --skip: Perintah ini digunakan ketika kita menghadapi konflik tetapi memutuskan untuk mengabaikan atau melewatkan commit yang sedang bermasalah tersebut. Git akan membatalkan perubahan dari commit itu dan langsung melanjutkan proses rebase dengan commit selanjutnya.

git rebase --abort: Opsi ini berfungsi sebagai tombol "batal darurat". Jika proses rebase mengalami masalah atau kita berubah pikiran, perintah ini akan menghentikan seluruh operasi rebase dan mengembalikan branch kita ke keadaan semula, tepat sebelum git rebase dimulai.
*Resource*: https://codeinthehole.com/guides/resolving-conflicts-during-a-git-rebase/



*Pertanyaan 4*
*Apa perbedaan Git Merge dengan Git Rebase? Buatlah ilustrasi yang menggambarkan perbedaannya!*

*Jawab*
Git Merge berfungsi dengan mengambil semua perubahan dari satu branch dan menggabungkannya ke branch lain melalui sebuah commit baru yang disebut "merge commit". Metode ini mempertahankan riwayat commit asli dari kedua branch secara utuh apa adanya. Hasilnya adalah riwayat proyek yang terlihat bercabang (non-linear), yang dengan jelas menunjukkan titik di mana dua alur kerja yang berbeda disatukan. Karena tidak mengubah sejarah commit yang sudah ada, merge dianggap sebagai operasi yang "aman" dan sering digunakan untuk menggabungkan pekerjaan di branch bersama seperti main.

Git Rebase, di sisi lain, bekerja dengan menulis ulang sejarah commit. Ia mengambil semua commit dari branch fitur kita dan memindahkannya satu per satu ke atas commit terbaru di branch utama. Ini menciptakan riwayat commit yang lurus (linear) dan lebih bersih, seolah-olah semua pekerjaan dilakukan secara berurutan di branch utama. Rebase sangat ideal digunakan untuk merapikan branch fitur kita secara lokal sebelum membagikannya atau menggabungkannya ke branch utama.

Analogi : Merge itu seperti pertemuan dua sungai di satu titik; kedua aliran sungai aslinya tetap terlihat dan menyatu di satu titik baru. Sebaliknya, rebase ibarat memindahkan hulu sungai (cabang fitur) kita ke titik akhir sungai utama, sehingga terlihat seolah-olah sungai kita selalu mengalir lurus dari titik akhir tersebut tanpa pernah bercabang.

*Resource*: https://www.geeksforgeeks.org/git/git-difference-between-merging-and-rebasing/ 



*Pertanyaan 5*
*Mengapa hal pada langkah no 4 bisa terjadi? Mengapa git stash menjadi solusinya? Bagaimana jika kita tidak melakukan Git Stash Pop?*

*Jawab*
Masalah yang terjadi pada langkah ke-4 muncul karena kita memiliki perubahan lokal pada file yang belum di-commit. Git secara otomatis menolak perpindahan branch dalam kondisi ini untuk melindungi kita dari potensi kehilangan data, sebab perubahan yang belum disimpan itu bisa saja tertimpa atau hilang saat berpindah branch.

git stash menjadi solusi karena perintah ini berfungsi sebagai tempat penyimpanan sementara. Ia mengambil semua modifikasi yang belum di-commit tersebut dan menyimpannya dalam sebuah "kantong" (stash), sehingga working directory kita kembali ke kondisi bersih (sama seperti commit terakhir). Setelah bersih, Git mengizinkan kita untuk berpindah branch dengan aman.

Jika kita tidak menjalankan git stash pop setelah kembali ke branch asal, perubahan yang kita simpan tadi tidak akan diterapkan kembali ke file kita. Perubahan tersebut akan tetap aman tersimpan di dalam daftar stash sampai kita memutuskan untuk mengambilnya. Singkatnya, git stash memungkinkan kita menyimpan, mengambil kembali, atau membatalkan draf pekerjaan tanpa harus mengotori riwayat commit proyek.

*Resource*: https://git-scm.com/docs/git-stash



*Pertanyaan 6*
*Sebutkan dan jelaskan tiga tipe dari Git Reset!*

*Jawab*
--soft: Saat kita menggunakannya, Git hanya akan memindahkan penunjuk HEAD ke commit target yang kita tentukan. Perubahan pada file kita, baik yang sudah ada di staging area (index) maupun yang masih di working directory, tidak akan disentuh sama sekali.

--mixed: Ini adalah mode default (mode yang digunakan jika kita tidak mengetikkan opsi apa pun). Perintah ini akan memindahkan HEAD ke commit target dan sekaligus membersihkan staging area (index). Namun, file-file yang sudah kita ubah di working directory tetap aman dan tidak akan berubah.

--hard: Ini adalah opsi yang paling drastis dan harus digunakan dengan hati-hati. Perintah ini tidak hanya memindahkan HEAD dan membersihkan staging area, tetapi juga akan menghapus semua perubahan di working directory agar kondisinya kembali sama persis seperti commit target. Hal ini sangat berisiko karena semua pekerjaan yang belum di-commit akan hilang secara permanen.

*Resource*: https://git-scm.com/docs/git-reset




*Pertanyaan 7*
*Apa itu git revert? Apa perbedaannya dengan git reset?*

*Jawab*
git revert adalah sebuah perintah yang kita gunakan untuk membatalkan commit yang sudah ada. Perintah ini bekerja dengan cara membuat sebuah commit baru yang berisi kebalikan (inversi) dari perubahan yang dilakukan oleh commit target. Ini adalah cara yang aman untuk membatalkan perubahan karena tidak menghapus riwayat; sebaliknya, ia menambahkan riwayat baru.

Perbedaan mendasarnya dengan git reset adalah pada penanganan riwayat. Jika git revert meniadakan perubahan dengan commit baru, git reset justru bekerja dengan memindahkan HEAD (penunjuk branch saat ini) ke commit spesifik di masa lalu. Akibatnya, git reset (terutama dengan opsi --hard) dapat menghapus riwayat commit yang terjadi setelah titik commit target tersebut, seolah-olah commit itu tidak pernah terjadi.

*Resource*: https://www.geeksforgeeks.org/git/git-difference-between-git-revert-checkout-and-reset/ 