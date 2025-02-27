
const observer = new MutationObserver((mutationsList, observer) => {
    const STORAGE_KEY = "typedocMenuState";
    const menu = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    const getType = (target) => {
        let type = null;
        const tagName = target.tagName;
        if(tagName == 'UL') {
            const element = target.querySelector(':scope > li > a > svg');
            if(element) {
                type = element.getAttribute('aria-label').toLowerCase();
            }
        } else if(tagName == 'DETAILS') {
            type = target.querySelector(':scope > summary > a > svg').getAttribute('aria-label').toLowerCase();
        }
        return type;
    }

    mutationsList.forEach((mutation) => {
        // Tipo di modifica
        if(mutation.type == 'attributes') {
            if(mutation.attributeName == 'class') {
                let type = getType(mutation.target);
                if(type) {
                    console.log(menu)
                    if(type == 'module') {
                        const li = mutation.target.closest('li');
                        const index = Array.from(li.parentNode.children).indexOf(li);
                        const label = mutation.target.querySelector(':scope span').firstChild.textContent;

                        if(!menu[index]) {
                            menu[index] = { label: label, open: false, items: [] };
                        }

                        const summary = mutation.target.querySelector(':scope > summary');
                        const isOpen = mutation.target.getAttribute('open') !== null;

                        console.log('create - open', isOpen, menu[index].open, isOpen != menu[index].open, summary)

                        if(isOpen != menu[index].open) {
                            //summary.click();
                        }

                        console.log('create', type, index, label, mutation)
                    } else if(type == 'namespace') {
                        const liNamespace = mutation.target.closest('li');
                        const liModule = liNamespace.closest('details').closest('li');
                        const indexNamespace = Array.from(liNamespace.parentNode.children).indexOf(liNamespace);
                        const indexModule = Array.from(liModule.parentNode.children).indexOf(liModule);
                        const labelModule = liModule.querySelector(':scope > details > summary > a > span').firstChild.textContent;
                        const labelNamespace = mutation.target.querySelector(':scope span').firstChild.textContent;

                        if(!menu[indexModule]) {
                            menu[indexModule] = { label: labelModule, open: false, items: [] };
                        }
                        if(!menu[indexModule].items[indexNamespace]) {
                            menu[indexModule].items[indexNamespace] = { label: labelNamespace, open: false, items: [] };
                        }
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(menu));
                        console.log('create', type, indexModule, indexNamespace, labelModule, labelNamespace, menu, mutation)
                    }
                }
            } else if(mutation.attributeName == 'open') {
                let type = getType(mutation.target);
                const isOpen = mutation.target.getAttribute('open') !== null;

                if(type == 'module') {
                    const li = mutation.target.closest('li');
                    const index = Array.from(li.parentNode.children).indexOf(li);

                    if(menu[index].open != isOpen) {
                        menu[index].open = isOpen;
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(menu));
                        console.log('open', type, isOpen, index, menu[index], menu);
                    }
                } else if(type == 'namespace') {
                    const liNamespace = mutation.target.closest('li');
                    const liModule = liNamespace.closest('details').closest('li');
                    const indexNamespace = Array.from(liNamespace.parentNode.children).indexOf(liNamespace);
                    const indexModule = Array.from(liModule.parentNode.children).indexOf(liModule);

                    if(menu[indexModule].items[indexNamespace].open != isOpen) {
                        menu[indexModule].items[indexNamespace].open = isOpen;
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(menu));
                        console.log('open', type, isOpen, indexModule, indexNamespace, menu[indexModule].items[indexNamespace], menu);
                    }
                }
            }
        } else if(mutation.type == 'childList') {
            if(mutation.target.classList.contains('current')) {

            }
            //console.log('@@@@', mutation);
        }
    });
});

observer.observe(document.getElementById('tsd-nav-container'), {
    attributes: true,        // Monitora gli attributi
    childList: true,        // Monitora aggiunta/rimozione di figli
    subtree: true,          // Monitora tutto l'albero dei discendenti
    attributeOldValue: true // Opzionale: registra il valore precedente degli attributi
});
