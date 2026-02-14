from comfy_api.latest import ComfyExtension, io

class QoLPackExtension(ComfyExtension):
    async def get_node_list(self) -> list[type[io.ComfyNode]]:
        return []

async def comfy_entrypoint() -> QoLPackExtension:
    return QoLPackExtension()

WEB_DIRECTORY = "./web"

__all__ = ["comfy_entrypoint", "WEB_DIRECTORY"]
