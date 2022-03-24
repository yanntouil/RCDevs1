const UI = {}

/**
 * @class Icon
 */
UI.Icon = class Icon {
	constructor(src) {
		this.src = src;
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
        // Bind hover state
        elMenuItem.addEventListener('click', () => {
            elMenuItem.classList.add(haveChild ? 'with_child_on' : 'no_child_on')
            elMenuItem.classList.remove('all_off')
            document.addEventListener("click", this.clickOutsideListener)
        })
        this.clickOutsideListener = ({ target }) => {
            let clickTarget = target
            do {
                if (clickTarget === elMenuItem) return
                clickTarget = clickTarget.parentNode
            } while (clickTarget);
            document.removeEventListener("click", this.clickOutsideListener)
            elMenuItem.classList.remove(haveChild ? 'with_child_on' : 'no_child_on')
            elMenuItem.classList.add('all_off')
        }
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
            this.children.forEach(menuItem => elSubmenu.append(menuItem.getElement(true)))
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
    }
	add (menuItem) {
        this.children.push(menuItem)
	}
	appendTo (DOMElement) {
        const elMenu = document.createElement('ul')
        elMenu.classList.add('menu', 'horizontal', 'ltr')
        this.children.forEach(menuItem => 
            elMenu.append(menuItem.getElement(false))
        )
        DOMElement.append(elMenu)
	}
}



