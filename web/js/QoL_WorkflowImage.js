import { app } from "../../../scripts/app.js";

class WorkflowImage {
	getBounds() {
		// Calculate the min max bounds for the nodes on the graph
		const bounds = app.graph._nodes.reduce(
			(p, n) => {
				if (n.pos[0] < p[0]) p[0] = n.pos[0];
				if (n.pos[1] < p[1]) p[1] = n.pos[1];
				const bounds = n.getBounding();
				const r = n.pos[0] + bounds[2];
				const b = n.pos[1] + bounds[3];
				if (r > p[2]) p[2] = r;
				if (b > p[3]) p[3] = b;
				return p;
			},
			[99999, 99999, -99999, -99999]
		);

		bounds[0] -= 100;
		bounds[1] -= 100;
		bounds[2] += 100;
		bounds[3] += 100;
		return bounds;
	}

	saveState() {
		this.state = {
			scale: app.canvas.ds.scale,
			width: app.canvas.canvas.width,
			height: app.canvas.canvas.height,
			offset: app.canvas.ds.offset,
			transform: app.canvas.canvas.getContext("2d").getTransform(),
		};
	}

	restoreState() {
		app.canvas.ds.scale = this.state.scale;
		app.canvas.canvas.width = this.state.width;
		app.canvas.canvas.height = this.state.height;
		app.canvas.ds.offset = this.state.offset;
		app.canvas.canvas.getContext("2d").setTransform(this.state.transform);
	}

	updateView(bounds) {
		const scale = window.devicePixelRatio || 1;
		app.canvas.ds.scale = 1;
		app.canvas.canvas.width = (bounds[2] - bounds[0]) * scale;
		app.canvas.canvas.height = (bounds[3] - bounds[1]) * scale;
		app.canvas.ds.offset = [-bounds[0], -bounds[1]];
		app.canvas.canvas.getContext("2d").setTransform(scale, 0, 0, scale, 0, 0);
	}

	async export(includeWorkflow) {
		this.saveState();
		this.updateView(this.getBounds());
		app.canvas.draw(true, true);
		const blob = await this.getBlob(JSON.stringify(app.graph.serialize()));
		this.restoreState();
		app.canvas.draw(true, true);
		this.download(blob);
	}

	download(blob) {
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		Object.assign(a, {
			href: url,
			download: "workflow." + this.extension,
			style: "display: none",
		});
		document.body.append(a);
		a.click();
		setTimeout(function () {
			a.remove();
			window.URL.revokeObjectURL(url);
		}, 0);
	}
}

class QoL_PngWorkflowImage extends WorkflowImage {
	extension = "png";

	n2b(n) {
		return new Uint8Array([(n >> 24) & 0xff, (n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]);
	}

	joinArrayBuffer(...bufs) {
		const result = new Uint8Array(bufs.reduce((totalSize, buf) => totalSize + buf.byteLength, 0));
		bufs.reduce((offset, buf) => {
			result.set(buf, offset);
			return offset + buf.byteLength;
		}, 0);
		return result;
	}

	crc32(data) {
		const crcTable =
			QoL_PngWorkflowImage.crcTable ||
			(QoL_PngWorkflowImage.crcTable = (() => {
				let c;
				const crcTable = [];
				for (let n = 0; n < 256; n++) {
					c = n;
					for (let k = 0; k < 8; k++) {
						c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
					}
					crcTable[n] = c;
				}
				return crcTable;
			})());
		let crc = 0 ^ -1;
		for (let i = 0; i < data.byteLength; i++) {
			crc = (crc >>> 8) ^ crcTable[(crc ^ data[i]) & 0xff];
		}
		return (crc ^ -1) >>> 0;
	}

	async getBlob(workflow) {
		return new Promise((r) => {
			app.canvasEl.toBlob(async (blob) => {
				if (workflow) {
					// If we have a workflow embed it in the PNG
					const buffer = await blob.arrayBuffer();
					const typedArr = new Uint8Array(buffer);
					const view = new DataView(buffer);

					const data = new TextEncoder().encode(`tEXtworkflow\0${workflow}`);
					const chunk = this.joinArrayBuffer(this.n2b(data.byteLength - 4), data, this.n2b(this.crc32(data)));

					const sz = view.getUint32(8) + 20;
					const result = this.joinArrayBuffer(typedArr.subarray(0, sz), chunk, typedArr.subarray(sz));

					blob = new Blob([result], { type: "image/png" });
				}
				r(blob);
			});
		});
	}
}

app.registerExtension({
	name: "Comfy.QoL.WorkflowImage",
	getCanvasMenuItems(canvas) {
		return [
			null,
			{
				content: "Save Workflow as PNG",
				callback: () => {
					new QoL_PngWorkflowImage().export(true);
				},
			},
		];
	},
});