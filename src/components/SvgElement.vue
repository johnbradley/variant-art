<script>
export default {
    render: function (createElement) {
        return createElement(
            this.shapeType,
            {
                attrs: this.attrObj
            },
            this.$slots.default
        )
    },
    props: {
        shapeType: {
            type: String,
            required: true
        },
        attrs: {
            type: Object
        }
    },
    computed: {
        attrObj() {
            return this.attrs
        }
    }
}
</script>



