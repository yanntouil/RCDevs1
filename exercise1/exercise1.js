const UI = {}

/**
 * @class Icon
 */
UI.Icon = class Icon {
	constructor(src) {
		this.src = src
	}
}

/**
 * @class MenuItem
 */
UI.MenuItem = class MenuItem {
	constructor({ label, href, click, icon }) {
		this.label = label
        this.type = href ? 'link' : click ? 'button' : 'label'
        if (click) this.click = click
        if (href) this.href = href
        if (icon) this.icon = icon
        this.children = []
	}
    add (menuItem) {
        this.children.push(menuItem)
    }
    getElement (subMenuArrows = false) {
        const haveChild = this.children.length > 0
        const elMenuItem = document.createElement('li')
        elMenuItem.classList.add('all_off', haveChild ? 'with_child' : 'no_child')
        // Link or button or label
        const elLink = document.createElement('a')
        elLink.innerHTML = `
            <table>
                <tbody>
                    <tr>
                        <td>${this.icon ? `<img src="${this.icon.src}">` : ''}</td>
                        <td>${this.label}</td>
                        ${haveChild && subMenuArrows ? `
                            <td>
                                <img src='right_arrow.png'>
                            <td>
                        ` : ''}
                    </tr>
                </tbody>
            </table>
        `
        if (this.type === 'button') elLink.addEventListener('click', this.click)
        else if (this.type === 'link') elLink.setAttribute('href', this.href)
        elMenuItem.append(elLink)
        // Children elements
        if (haveChild) {
            const elSubmenu = document.createElement('ul')
            this.children.forEach(menuItem => {
                elSubmenu.append(menuItem.getElement(true))
            })
            elMenuItem.append(elSubmenu)
        }
        return elMenuItem
    }
}

/**
 * @class Menu
 */
UI.Menu = class Menu {
    constructor() {
        this.children = []
        this.active = false
    }

    /**
     * Add a child
     */
	add (menuItem) {
        this.children.push(menuItem)
	}

    /**
     * Create menu element, append it to dom element and bind behviour
     */
	appendTo (DOMElement) {
        // Create and append menu to the dom element
        this.element = document.createElement('ul')
        this.element.classList.add('menu', 'horizontal', 'ltr')
        this.children.forEach(menuItem => {
            menuItem.menu = this
            this.element.append(menuItem.getElement(false))
        })
        DOMElement.append(this.element)
        // Bind click on menu
        this.element.addEventListener('click', this.activeMenu.bind(this))
        // MenuItem behviour
        this.element.querySelectorAll('li').forEach(el => {
            el.addEventListener('mouseover', ({ target }) => {
                const itemClicked = target.closest('li')
                if(this.active) this.openItem(itemClicked)
            })
        })
	}

    /**
     * Active menu and bind clickOut to disable it
     */
    activeMenu ({ target }) {
        if (this.active) return
        const itemClicked = target.closest('li')
        this.openItem(itemClicked)
        this.active = true
        // Bind click outside
        this.clickOutsideListener = this.clickOutside.bind(this)
        document.addEventListener("click", this.clickOutsideListener)
    }

    /**
     * Handel click outside
     */
    clickOutside ({ target }) {
        let clickTarget = target
        do {
            if (clickTarget === this.element) return
            clickTarget = clickTarget.parentNode
        } while (clickTarget)
        this.active = false
        this.disableAllItems()
        document.removeEventListener("click", this.clickOutsideListener)
    }

    /**
     * Disable all items
     */
    disableAllItems () {
        this.element.querySelectorAll('li').forEach(el => this.disableItem(el))
    }

    /**
     * Disable all items except branch between menu and current item
     */
    openItem (itemEl) {
        this.disableAllItems()
        let el = itemEl
        while (el) {
            this.activeItem(el)
            if(el.parentNode === this.element) return
            el = el.parentNode.parentNode// ul < li
        }
    }

    /**
     * Switch to active class an item
     */
    activeItem(el) {
        if (el.classList.contains('with_child')) el.classList.add('with_child_on')
        else el.classList.add('no_child_on')
        el.classList.remove('all_off')
    }

    /**
     * Switch to disabled class an item
     */
    disableItem(el) {
        if (el.classList.contains('with_child')) el.classList.remove('with_child_on')
        else el.classList.remove('no_child_on')
        el.classList.add('all_off')
    }
}
