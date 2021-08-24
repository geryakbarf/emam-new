var app = new Vue({
    el: '#auth',
    data: {
        loading: false,
        needRegistered: false,
        loginErrMessage: null,
        formRegisterErrMessage: null, 
        user: {
            username: null,
            nama: null,
            username: null,
            email:null,
            tglLahir:null,
            jenisKelamin: null,
            avatar: null,
            bio: '',
            provider: null
        },
        provider: {id: "", name: ""}
    },
    watch: {
        'user.username': {
            deep: true,
            handler: function (val) {
                
                this.user.username = val.toLowerCase();
            }
        },
    },
    methods: {
        signInWithGoogle: function(){
            this.loading = true;
            firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider())
        },
        authenticate: function(provider) {
            const $this = this;
            this.loading = true;
            fetch(emapi_base+ "/v1/login",{
                method: "post",
                body: JSON.stringify({provider}),
                headers: {'Content-Type': "application/json"}
            }).then(function(res){
                if(res.status == 500) throw new Error("internal server error");
                return res.json();
            }).then(function(res){
                if(res.err_code && res.err_code == "002"){
                    $this.needRegistered = true;
                    $this.loading = false;
                } else {
                    localStorage.setItem("token", res.data.token);
                    window.location = "/sess?token="+ res.data.token;
                }
            }).catch(function(error){
                console.log(error);
                $this.loading = false;
                $this.loginErrMessage = "Terjadi kesalahan, mohon hubungi admin";
            });
        },
        validateFormRegister: function(){
            this.formRegisterErrMessage = null;
            if(!this.user.nama) this.formRegisterErrMessage = "Nama lengkap tidak boleh kosong!";
            else if(!this.user.username) this.formRegisterErrMessage = "Username tidak boleh kosong!";
            else if(!this.user.username.match(/^\w+$/)) this.formRegisterErrMessage = "Username harus berupa huruf, angka dan underscore!";
            else if(!this.user.email) this.formRegisterErrMessage = "E-Mail tidak boleh kosong!";
            else if(!this.user.tglLahir) this.formRegisterErrMessage = "Tanggal lahir tidak boleh kosong!";
            else if(!this.user.jenisKelamin) this.formRegisterErrMessage = "Pilih jenis kelamin!";
        },
        registerUser: function(e) {
            this.validateFormRegister();
            if(!this.formRegisterErrMessage) {
                const $this = this;
                this.user.provider = this.provider;
                this.loading = true;
                fetch(emapi_base+ "/v1/register",{
                    method: "post",
                    body: JSON.stringify(this.user),
                    headers: {'Content-Type': "application/json"}
                }).then(function(res){
                    if(res.status == 500) throw new Error("internal server error");
                    return res.json();
                }).then(function(res){
                    if(res.err_code && res.err_code == "004"){
                        $this.loading = false;
                    }else if(res.err_code && res.err_code == "400"){
                        $this.loading = false;
                        $this.formRegisterErrMessage = res.message;
                    } else {
                        localStorage.setItem("token", res.data.token);
                        window.location = "/sess?token="+ res.data.token;
                    }
                }).catch(function(error){
                    console.log(error);
                    $this.loading = false;
                    $this.formRegisterErrMessage = "Terjadi kesalahan, mohon hubungi admin";
                });
            }
            e.preventDefault();
        }
    },
    filters: {
    },
    mounted() {
        const $this = this;
        this.loading = true;
        this.$nextTick(function () {
            firebase.auth().getRedirectResult().then(function(result) {
                const token = result.credential.accessToken;
                const user = result.user;
                const provider = {id: user.uid, name: "google.com"};
                $this.user.nama = user.displayName;
                $this.user.email = user.email;
                $this.user.avatar = user.photoURL;
                $this.provider = provider;
                $this.authenticate(provider);
            }).catch(function(error) {
                $this.loading = false;
                if(error == "TypeError: Cannot read property 'accessToken' of undefined"){
                    return;
                }
                var errorCode = error.code;
                console.log(error);
                if(errorCode != "auth/popup-closed-by-user"){
                    $this.loginErrMessage = "Terjadi kesalahan, mohon hubungi admin";
                }
            });
        })
    }
})
