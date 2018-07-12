function formathtmljscss(source, spaceWidth, formatType) {
    this.source = source;
    this.spaceStr = "    ";
    if (!isNaN(spaceWidth)) {
        if (spaceWidth > 1) {
            this.spaceStr = "";
            for (var i = 0; i < spaceWidth; i++) {
                this.spaceStr += " ";
            }
        }
        else {
            this.spaceStr = "\t";
        }
    }
    this.formatType = formatType;
    this.output = [];
}
formathtmljscss.prototype.removeSpace = function () {
    this.source = this.source.replace(/\s+|\n/g, " ")
        .replace(/\s*{\s*/g, "{")
        .replace(/\s*}\s*/g, "}")
        .replace(/\s*:\s*/g, ":")
        .replace(/\s*;\s*/g, ";");
}
formathtmljscss.prototype.split = function () {
    var bigqleft = this.source.split("{");
}
formathtmljscss.prototype.split = function () {
    var bigqleft = this.source.split("{");
    var bigqright;
    for (var i = 0; i < bigqleft.length; i++) {
        if (bigqleft[i].indexOf("}") != -1) {
            bigqright = bigqleft[i].split("}");
        }
        else {

        }
    }
}
formathtmljscss.prototype.split = function () {
    var bigqleft = this.source.split("{");
    var bigqright;
    for (var i = 0; i < bigqleft.length; i++) {
        if (bigqleft[i].indexOf("}") != -1) {
            bigqright = bigqleft[i].split("}");
            var pv = bigqright[0].split(";");
            for (var j = 0; j < pv.length; j++) {
                pv[j] = this.formatStatement(this.trim(pv[j]), true);
                if (pv[j].length > 0) {
                    this.output.push(this.spaceStr + pv[j] + ";\n");
                }
            }
            this.output.push("}\n");
            bigqright[1] = this.trim(this.formatSelect(bigqright[1]));
            if (bigqright[1].length > 0) {
                this.output.push(bigqright[1], " {\n");
            }
        }
        else {
            this.output.push(this.trim(this.formatSelect(bigqleft[i])), " {\n");
        }
    }
}
formathtmljscss.prototype.trim = function (str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
formathtmljscss.prototype.formatSelect = function (str) {
    return str.replace(/\./g, " .")
        .replace(/\s+/g, " ")
        .replace(/\. /g, ".")
        .replace(/\s*,\s*/g, ",");
}
formathtmljscss.prototype.formatStatement = function (str, autoCorrect) {
    str = str.replace(/:/g, " : ")
        .replace(/\s+/g, " ")
        .replace("# ", "#")
        .replace(/\s*px/ig, "px")
        .replace(/\s*-\s*/g, "-")
        .replace(/\s*:/g, ":");

    return str;
}
formathtmljscss.prototype.formatcss = function () {
    if (this.formatType == "compress") {
        this.removeSpace();
    }
    else {
        this.removeSpace();
        this.split();
        this.source = this.output.join("");
    }
}
export default {
    formathtmljscss
}
