import { app } from "../../../scripts/app.js";
import { $el } from "../../../scripts/ui.js";

app.registerExtension({
	name: "Comfy.QoL.BetterCombos",
	init() {
		$el("style", {
			textContent: `
				.comfy-utils-combo-folder { opacity: 0.7; }
				.comfy-utils-combo-folder-arrow { display: inline-block; width: 15px; }
				.comfy-utils-combo-folder:hover { background-color: rgba(255, 255, 255, 0.1); }
				.comfy-utils-combo-prefix { display: none; }

				.litecontextmenu:has(input:not(:placeholder-shown)) .comfy-utils-combo-folder-contents { display: block !important; }
				.litecontextmenu:has(input:not(:placeholder-shown)) .comfy-utils-combo-folder { display: none; }
				.litecontextmenu:has(input:not(:placeholder-shown)) .comfy-utils-combo-prefix { display: inline; }
				.litecontextmenu:has(input:not(:placeholder-shown)) .litemenu-entry { padding-left: 2px !important; }
			`,
			parent: document.body,
		});

		const positionMenu = (menu) => {
			let left = app.canvas.last_mouse[0] - 10;
			let top = app.canvas.last_mouse[1] - 10;
			const body_rect = document.body.getBoundingClientRect();
			const root_rect = menu.getBoundingClientRect();
			if (body_rect.width && left > body_rect.width - root_rect.width - 10) {
				left = body_rect.width - root_rect.width - 10;
			}
			if (body_rect.height && top > body_rect.height - root_rect.height - 10) {
				top = body_rect.height - root_rect.height - 10;
			}
			menu.style.left = `${left}px`;
			menu.style.top = `${top}px`;
		};

		const createTree = (menu) => {
			const items = [...menu.querySelectorAll(".litemenu-entry")];
			const splitBy = /[\/\\]/;
			const folderMap = new Map();
			const rootFiles = [];
			const itemsSymbol = Symbol("items");

			for (const item of items) {
				const fullPath = item.textContent || item.getAttribute("data-value") || "";
				const path = fullPath.split(splitBy).filter(p => p);

				if (path.length <= 1) {
					rootFiles.push(item);
					continue;
				}
				
				item.textContent = path[path.length - 1];
				item.prepend($el("span.comfy-utils-combo-prefix", { textContent: path.slice(0, -1).join("/") + "/" }));

				let currentLevel = folderMap;
				for (let j = 0; j < path.length - 1; j++) {
					const folder = path[j];
					if (!currentLevel.has(folder)) {
						currentLevel.set(folder, new Map());
					}
					currentLevel = currentLevel.get(folder);
				}
				if (!currentLevel.has(itemsSymbol)) {
					currentLevel.set(itemsSymbol, []);
				}
				currentLevel.get(itemsSymbol).push(item);
			}

			for(const item of items) {
				item.remove();
			}

			const insertFolderStructure = (parentElement, map, level = 0) => {
				const sortedFolderEntries = [...map.entries()]
					.filter(([key]) => key !== itemsSymbol)
					.sort((a, b) => a[0].localeCompare(b[0]));

				for (const [folderName, content] of sortedFolderEntries) {
					const folderEl = $el("div.litemenu-entry.comfy-utils-combo-folder", {
						textContent: folderName,
						style: { paddingLeft: `${level * 10 + 5}px` },
					});
					const arrow = $el("span.comfy-utils-combo-folder-arrow", { textContent: "▶ " });
					folderEl.prepend(arrow);
					
					const contentsEl = $el("div.comfy-utils-combo-folder-contents", {
						style: { display: "none" },
					});

					folderEl.addEventListener("click", (e) => {
						e.stopPropagation();
						const visible = contentsEl.style.display !== "none";
						contentsEl.style.display = visible ? "none" : "block";
						arrow.textContent = visible ? "▶ " : "▼ ";
					});

					parentElement.appendChild(folderEl);
					parentElement.appendChild(contentsEl);

					insertFolderStructure(contentsEl, content, level + 1);
				}
				
				const filesInCurrentFolder = (map.get(itemsSymbol) || []).sort((a,b) => a.textContent.localeCompare(b.textContent));
				for (const item of filesInCurrentFolder) {
					item.style.paddingLeft = `${(level + 1) * 10 + 14}px`;
					parentElement.appendChild(item);
				}
			};

			insertFolderStructure(menu, folderMap);

			for (const item of rootFiles.sort((a, b) => a.textContent.localeCompare(b.textContent))) {
				menu.appendChild(item);
			}

			positionMenu(menu);
		};

		const mutationObserver = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				for (const added of mutation.addedNodes) {
					if (added.classList?.contains("litecontextmenu")) {
						const entries = added.querySelectorAll(".litemenu-entry");
						if (!entries?.length) return;

						const hasPaths = Array.from(entries).some(
							(el) => (el.textContent || el.getAttribute("data-value") || "").includes("/") ||
									   (el.textContent || el.getAttribute("data-value") || "").includes("\\")
						);

						if (hasPaths) {
							requestAnimationFrame(() => {
								if (!added.querySelector(".comfy-context-menu-filter")) return;
								const position = added.getBoundingClientRect();
								const maxHeight = window.innerHeight - position.top - 20;
								added.style.maxHeight = `${maxHeight}px`;
								createTree(added);
						});
						}
					return;
					}
				}
			}
		});
		mutationObserver.observe(document.body, { childList: true, subtree: false });
	},
});
