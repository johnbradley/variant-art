<script>
export default {
  data() {
    return {
      isRed: true
    }
  },
  render(h) {
    return h('div', {
      'class': {
        'is-red': this.isRed
      }
    }, [
      h('p', 'Example Text')
    ])
  }
}
</script>