class Gamepad {
    constructor() {
        // Styles available in this project
        this.styles = ['ds4']

        // Bind listeners
        window.addEventListener("gamepadconnected", this.onGamepadConnected.bind(this));
        window.addEventListener("gamepaddisconnected", this.onGamepadDisconnected.bind(this));

        this.loadStyles()
    }

    loadStyles() {
        if (!window.location.search || !window.location.search.startsWith("?style="))
            throw new Error('No controller style passed in URL')
        document.querySelector("#unloaded").remove()

        window.location.search.substring(7).split(";").forEach(style => {
            const link = document.createElement('link')
            link.rel = "stylesheet"
            link.href = this.styles.includes(style) ? `./styles/${style}/gamepad.css` : style
            document.head.appendChild(link)
        })
    }

    renderGamepad() {
        const gamepads = navigator.getGamepads()
        if (!gamepads || !gamepads.length) return
        const gamepad = gamepads[0]

        for (let i = 0; i < gamepad.buttons.length; i++)
            document.querySelector(`[data-button="${i}"]`).dataset.pressed = gamepad.buttons[i].pressed
        window.requestAnimationFrame(this.renderGamepad.bind(this))
    }

    onGamepadConnected(event) {
        document.querySelector("#undetected").style.visibility = 'hidden';
        this.renderGamepad()
    }

    onGamepadDisconnected(event) {
        document.querySelector("#undetected").style.visibility = 'visible';
        console.log("bye")
    }
}

// Initialize
if (navigator.getGamepads) {
    document.querySelector("#unsupported").remove()
    window.gamepad = new Gamepad()
}
