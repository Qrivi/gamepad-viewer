class Gamepad {
    constructor() {
        this.lowPrecision = 1
        this.highPrecision = 3

        // Styles available in this project
        this.styles = ['ds4']

        // Last recorded gamepad timestamp
        this.timestamp = 0

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
        const gamepad = navigator.getGamepads()?.[0]
        if (!gamepad)
            return

        if (this.timestamp != gamepad.timestamp.toFixed()) {
            // Handle button presses
            for (let i = 0; i < gamepad.buttons.length; i++) {
                const button = document.querySelector(`[data-button="${i}"]`)
                if (button) {
                    button.dataset.pressed = gamepad.buttons[i].pressed
                    button.dataset.value = gamepad.buttons[i].value.toFixed(this.highPrecision)
                    if (button.classList.contains("trigger")) {
                        this.updateTrigger(button)
                    }
                }
            }
            // Handle joystick motion
            for (let i = 0; i < gamepad.axes.length; i++) {
                const axisX = document.querySelector(`[data-axis-x="${i}"]`)
                if (axisX) {
                    axisX.dataset.valueX = gamepad.axes[i].toFixed(this.highPrecision)
                    this.updateStick(axisX)
                    continue
                }
                const axisY = document.querySelector(`[data-axis-y="${i}"]`)
                if (axisY) {
                    axisY.dataset.valueY = gamepad.axes[i].toFixed(this.highPrecision)
                    this.updateStick(axisY)
                    continue
                }
                const axisZ = document.querySelector(`[data-axis-z="${i}"]`)
                if (axisZ) {
                    axisZ.dataset.valueZ = gamepad.axes[i].toFixed(this.highPrecision)
                    this.updateStick(axisZ)
                    continue
                }
            }
        }
        this.timestamp = gamepad.timestamp.toFixed()

        window.requestAnimationFrame(this.renderGamepad.bind(this))
    }

    updateStick(stick) {
        // Applying some style on each stick directly until css attr() is supported, which is when we'll be able to read
        // and apply data-value-[xyz] directly from our gamepad.css stylesheet. https://caniuse.com/css3-attr
        const marginTop = `${stick.dataset.valueY * 30}px`
        const marginLeft = `${stick.dataset.valueX * 30}px`
        if (marginTop != stick.style.marginTop || marginLeft != stick.style.marginLeft) {
            stick.style.marginTop = marginTop
            stick.style.marginLeft = marginLeft
            stick.style.transform = `rotateX(${stick.dataset.valueY * -30}deg) rotateY(${stick.dataset.valueX * 30}deg)`
        }

        stick.dataset.value = ((Math.abs(stick.dataset.valueX || 0) + Math.abs(stick.dataset.valueY || 0) + Math.abs(stick.dataset.valueZ || 0)) / stick.dataset.axes).toFixed(this.lowPrecision)
    }

    updateTrigger(trigger) {
        // Comment from above applies here too.
        trigger.style.transform = `rotateX(${trigger.dataset.value * -70}deg)`
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
