var detailFoodlist = new Vue({
    el: "#detailFoodlist",
    data() {
        return {
            headers: {
                'Content-Type': "application/json",
                'authorization': "Bearer "+ localStorage.getItem("token")
            },
            loading: false,
        }
    },
    methods: {
        deleteFoodList: async function(foodlistID){
            try {
                const $this = this;
                if(this.loading) return;
                if(!confirm("Anda yakin akan menghapus food list ini?")) return;
                this.loading = true;
                const res = await fetch(emapi_base+'/v1/foodlist-delete', {
                    method: "POST",
                    body: JSON.stringify({foodlistID}),
                    headers: this.headers
                });
                const data = await res.json();
                if(!res.ok) throw Error(data.message);
                Snackbar.show({pos: 'bottom-center', text: "Berhasil menghapus food list", actionTextColor: "#e67e22", duration: 1000});
                setTimeout(()=> {
                    $this.loading = false;
                    window.location = "/profile";
                }, 1000)    
            } catch (error) {
                console.log(error);
                this.loading = false;
                Snackbar.show({pos: 'bottom-center', text:"Gagal menghapus food list", actionTextColor: "#e67e22", duration: 3000});
            }
            
        },
        deleteItemFromFoodList: async function(foodListID, placeID){
            try {
                const $this = this;
                if(this.loading) return;
                if(!confirm("Anda yakin akan menghapus tempat ini ini dari foodlist?")) return;
                this.loading = true;
                const res = await fetch(emapi_base+'/v1/foodlist-removeplace', {
                    method: "POST",
                    body: JSON.stringify({foodListID, placeID}),
                    headers: this.headers
                });
                const data = await res.json();
                if(!res.ok) throw Error(data.message);
                Snackbar.show({pos: 'bottom-center', text: "Berhasil menghapus tempat dari food list", actionTextColor: "#e67e22", duration: 1000});
                setTimeout(()=> {
                    $this.loading = false;
                    window.location = window.location.href;
                }, 1000)    
            } catch (error) {
                console.log(error);
                this.loading = false;
                Snackbar.show({pos: 'bottom-center', text:"Gagal menghapus food list", actionTextColor: "#e67e22", duration: 3000});
            }
            
        },
        shareFoodList: async function(){
            if (navigator.canShare) {
                navigator.share({
                    title: 'Bagikan food list',
                    text: `${foodListData.nama} oleh ${foodListData.user.nama}`,
                    url: window.location.href,
                }).then(console.log).catch(console.error);
            } else if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href).then(function() {
                    Snackbar.show({
                        pos: 'bottom-center', 
                        text: "Link food list sudah dicopy", 
                        actionTextColor: "#e67e22", duration: 2000
                    });
                  })
                  .catch(function(error){
                    Snackbar.show({
                        pos: 'bottom-center', 
                        text: "Link food list sudah gagal dicopy", 
                        actionTextColor: "#e67e22", duration: 2000
                    });
                  });
                
            } else {
                Snackbar.show({
                    pos: 'bottom-center', 
                    text: "Maaf, fitur bagikan tidak support. Mohon copy url halaman ini secara manual!", 
                    actionTextColor: "#e67e22", duration: 2000
                });
            }
        }
    },
    mounted(){
    }
});