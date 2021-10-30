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
        attrString: {
            type: String
        }
    },
    computed: {
        attrObj() {
            return { cx: 50, cy: 50, r: 10, fill: 'red' }
        }
    }
}
</script>



