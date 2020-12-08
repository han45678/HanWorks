ELEMENT.locale(ELEMENT.lang.zhTW)

new Vue({
    el: '#app',
    data: () => ({
        value: '',
        tw: [{
            value: '台北市',
            label: '台北市',
            children: [{
                value: '士林區',
                label: '士林區',
            }, {
                value: '北投區',
                label: '北投區',
            }, {
                value: '中山區',
                label: '中山區',
            }]
        }, {
            value: '新北市',
            label: '新北市',
            children: [{
                value: '中山區',
                label: '中山區',
            }, {
                value: '松山區',
                label: '松山區',
            }, {
                value: '中正區',
                label: '中正區',
            }]
        }, {
            value: '桃園市',
            label: '桃園市',
            children: [{
                value: '大溪區',
                label: '大溪區',
            }, {
                value: '中壢區',
                label: '中壢區',
            }, {
                value: '蘆竹區',
                label: '蘆竹區',
            }]
        }, {
            value: '台中市',
            label: '台中市',
            children: [{
                value: '大雅區',
                label: '大雅區',
            }, {
                value: '潭子區',
                label: '潭子區',
            }, {
                value: '神岡區',
                label: '神岡區',
            }]
        }, {
            value: '台南市',
            label: '台南市',
            children: [{
                value: '南區',
                label: '南區'
            }, {
                value: '北區',
                label: '北區'
            }, {
                value: '中西區',
                label: '中西區'
            }]
        }, {
            value: '高雄市',
            label: '高雄市',
            children: [{
                value: '楠梓區',
                label: '楠梓區'
            }, {
                value: '岡山區',
                label: '岡山區'
            }, {
                value: '旗山區',
                label: '旗山區'
            }]
        }],
        info: null,
        address: "",
        radio: '1',
        radio1: '1',
        value_switch: false,
        months: 1,
        evaluation: null,
        colors: ['#ff0000', '#ff6200', '#FF9900'],
        texts: ['可憐哪', '不滿意', '還行', '滿意', '非常滿意'],
        banner: [{
                img: 'https://blog.shopline.tw/wp-content/uploads/2019/08/banner-6-skills-enhance-click-6.png'
            },
            {
                img: 'https://blog.shopline.tw/wp-content/uploads/2019/08/banner-6-skills-enhance-click-6.png'
            },
            {
                img: 'https://blog.shopline.tw/wp-content/uploads/2019/08/banner-6-skills-enhance-click-6.png'
            }
        ],
        menu_active: true,
        loading: false,
        activeName: 'first',
        time: new Date(),
        age: '',
        answer:null
    }),
    async created() {
        this.loading = true; //載入動畫顯示

        const promise = new Promise((resovle) => {
            //載入動畫延遲
            setInterval(() => {
                resovle('done');
            }, 850)
        });

        await promise;

        await axios.get('./assets/js/tw.json')
            .then(res => (this.info = res.data))
            //.then(function (res) {console.log(res);})
            .catch(function (error) {
                console.log(error);
            });

        this.loading = false; //載入完成後關閉
    },
    methods: {
        handleChange(value) {},
        handleClick(tab, event) {}
    },
    components: {
        "v-header": httpVueLoader(
            "./assets/shared/header.vue"
        ),
        "v-footer": httpVueLoader(
            "./assets/shared/footer.vue"
        ),
    }
})