<template>
    <div id="GasFryer" class="product_carousel wrapper">
        <h2>
            {{title}}
            <span class="subtitle">Gas fryer</span>
        </h2>
        <div class="item" v-for="item in products" :key="item.id">
            <div class="photo">
                <img :src="item.imageUrl" />
            </div>
            <div class="category text-center">{{item.category}}</div>
            <div class="title text-center">{{ item.title }}</div>
            <div class="price text-center">NT ＄{{ item.price }}</div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {

            }
        },
        props: {
            title: {
                type: String,
                required: false
            },
            products: {
                type: Array,
                required: false
            }

        }
    }
</script>