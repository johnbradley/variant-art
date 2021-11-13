<template>
  <v-container>
    <v-row>
      <v-col>
        <h3>Visualization <LegendDialog /></h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <span>VCF files: {{ fileNames }} </span>
        <v-btn v-on:click="promptForInput" small fab class="ma-2">
          <v-icon> mdi-pencil </v-icon>
        </v-btn>
      </v-col>
      <v-col>
        <v-select
          v-model="selectedChromosome"
          :items="uniqueChroms"
          label="Selected Chromosome"
          dense
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col align="center">
        <SvgPanZoom :zoomEnabled="true" :controlIconsEnabled="true">
          <svg width="80vw" height="400" style="border: 1px solid black">
            <SvgElement
              v-for="svg in computedSvgArray"
              :key="svg.key"
              :shapeType="svg.type"
              :attrs="svg.attrs"
              :children="svg.children"
            >
              <SvgElement
                v-for="svgchild in svg.children"
                :key="svgchild.key"
                :shapeType="svgchild.type"
                :attrs="svgchild.attrs"
                :children="svgchild.children"
              />
            </SvgElement>
            <text
              v-for="txt in computedText"
              :key="txt.key"
              :x="txt.x"
              :y="txt.y"
              font-size="12px"
            >
              {{ txt.content }}
            </text>
          </svg>
        </SvgPanZoom>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.legendText {
  font: 13px sans-serif;
}
</style>

<script>
import SvgElement from "../components/SvgElement";
import SvgPanZoom from "vue-svg-pan-zoom";
import LegendDialog from "../components/LegendDialog";
import { subwayMapConfig, makeResults } from "../visualizeVariants.js";

export default {
  name: "VisualizePanel",
  components: {
    SvgElement,
    SvgPanZoom,
    LegendDialog,
  },
  props: {
    vcfData: Array,
    selectedChromosome: String,
  },
  methods: {
    promptForInput() {
      this.$emit("promptForInput");
    },
  },
  data() {
    return {
      startX: 20,
      startY: 95,
      showLegend: true,
      showLabels: true,
    };
  },
  computed: {
    fileNames() {
      return this.vcfData
        .map(
          (x) =>
            x.file.split("/").reverse()[0].substr(0, x.file.indexOf(".")) ||
            x.file
        )
        .join(", ");
    },
    computedText() {
      if (!this.showLabels) {
        return [];
      }
      const result = [];
      var idx = 0;
      for (var fileVcfData of this.vcfData) {
        var filename = fileVcfData.file
          .split("/")
          .reverse()[0]
          .replace(".vcf", "");
        var x = this.startX + subwayMapConfig.labelLeftMargin;
        var y =
          this.startY +
          subwayMapConfig.height * idx +
          subwayMapConfig.labelTopMargin;
        result.push({
          key: `txt${idx}`,
          x: x,
          y: y + 40,
          content: `${this.selectedChromosome}: ${filename}`,
        });
        idx += 1;
      }
      return result;
    },
    computedSvgArray() {
      var x = this.startX + subwayMapConfig.labelWidth;
      var y = this.startY;
      const nd = {
        idx: 1,
      };
      const result = [];
      for (var fileVcfData of this.vcfData) {
        result.push(
          ...makeResults(fileVcfData, nd, x, y, this.selectedChromosome)
        );
        y += subwayMapConfig.height;
      }

      return result;
    },
    summaryVCFData() {
      const result = [];
      for (const fd of this.vcfData) {
        const chroms = new Set();
        for (const content of fd.contents) {
          chroms.add(content.CHROM);
        }
        result.push({
          filename: fd.file,
          chroms: Array.from(chroms).join(", "),
        });
      }
      return result;
    },
    uniqueChroms() {
      const chroms = new Set();
      for (const fd of this.vcfData) {
        for (const content of fd.contents) {
          chroms.add(content.CHROM);
        }
      }
      return Array.from(chroms);
    },
  },
};
</script>