<script type="text/jsx">
  export default {
    render: function (h) {
      return (
        <div>
          {this.$slots.default}
        </div>
      );
    },

    props: {
      widthOfItem: {
        type: Number,
        required: true
      },

      gapBetweenItem: {
        type: Number,
        default: 10
      },

      sizes: {
        type: Array,
        default: function () {
          return [
            {columns: 2}
          ]
        }
      },

      isResize: {
        type: Boolean,
        default: true
      },

      packedMark: {
        type: String,
        default: 'm-packed'
      }
    },

    created: function () {
      //define inner variable
      this.columns = 1;
      this.columnHeight = void [];
      this.nodes = void [];
      this.ticking = false;

      //initialization
      this.calculateColumns();

      //add window resize listener
      if (this.isResize) {
        window.addEventListener('resize', this.onResize);
      }
    },

    mounted: function () {
      this.repack();
    },

    destroy: function () {
      //remove window resize listener
      if (this.isResize) {
        window.removeEventListener('resize', this.onResize);
      }
    },

    methods: {
      //API

      pack: function () {
        this.$nextTick(() => {
          this.nodes = this.selectNewNode();
          this.setNodeStyle();
          this.setContainerStyle();
        });
      },

      repack: function () {
        this.columnHeight = this.createEmptyArray(this.columns);
        this.nodes = this.selectAllNode();
        this.setNodeStyle();
        this.setContainerStyle();
      },

      columnRepack: function (column) {
        this.$nextTick(() => {
          this.nodes = this.selectColumnNode(column);
          this.setColumnNodeStyle(column);
          this.setContainerStyle();
        })
      },

      //helper function

      //transfer html collection to an array
      toArray: function (input) {
        return Array.prototype.slice.call(input);
      },

      createEmptyArray: function (length) {
        return Array.apply(null, Array(length)).map(() => 0);
      },

      selectAllNode: function () {
        return this.toArray(this.$el.children);
      },

      selectNewNode: function () {
        return this.toArray(this.$el.children).filter(node => {
          return !node.hasAttribute(this.packedMark);
        });
      },

      selectColumnNode: function (column) {
        return this.toArray(this.$el.children).filter(node => {
          return node.hasAttribute(this.packedMark) && node.getAttribute(this.packedMark) === `${column}`;
        });
      },

      //core function

      calculateColumns: function () {
        let oldColumns = this.columns;

        let index = this.sizes
          .map(size => size.mq && window.matchMedia(`(min-width: ${size.mq})`).matches)
          .lastIndexOf(true);

        this.columns = index === -1 ?
          this.sizes[0].columns :
          this.sizes[index].columns;

        return oldColumns !== this.columns;
      },

      setNodeStyle: function () {
        this.nodes.forEach(node => {
          let targetColumn = this.columnHeight.indexOf(Math.min.apply(Math, this.columnHeight));

          let top = `${this.columnHeight[targetColumn]}px`;
          let left = `${targetColumn * (this.widthOfItem + this.gapBetweenItem)}px`;

          node.style.position = 'absolute';
          node.style.top = top;
          node.style.left = left;
          node.style.width = `${this.widthOfItem}px`;

          node.setAttribute(this.packedMark, `${targetColumn}`);

          this.columnHeight[targetColumn] += node.clientHeight + this.gapBetweenItem;
        });
      },

      setColumnNodeStyle: function (column) {
        let left = `${column * (this.widthOfItem + this.gapBetweenItem)}px`;
        this.columnHeight[column] = 0;

        this.nodes.forEach(node => {
          let top = `${this.columnHeight[column]}px`;

          node.style.position = 'absolute';
          node.style.top = top;
          node.style.left = left;
          node.style.width = `${this.widthOfItem}px`;

          this.columnHeight[column] += node.clientHeight + this.gapBetweenItem;
        });
      },

      setContainerStyle: function () {
        this.$el.style.position = 'relative';
        this.$el.style.width = `${this.columns * (this.widthOfItem + this.gapBetweenItem) - this.gapBetweenItem}px`;
        this.$el.style.height = `${Math.max.apply(Math, this.columnHeight) - this.gapBetweenItem}px`;
      },

      onResize: function () {
        if (!this.ticking) {
          window.requestAnimationFrame(this.resizeHandler);
          this.ticking = true;
        }
      },

      resizeHandler: function () {
        if (this.calculateColumns()) {
          this.repack();
        }

        this.ticking = false;
      }
    }
  }
</script>
