const data = {
    items: [],
};

chrome.runtime.onMessage.addListener(function (request) {
    data.items = request.items ?? [];
    updateDom();
});

chrome.storage.sync.get(function ({ karenProof_BlackList }) {
    data.items = karenProof_BlackList ?? [];
    if (data.items.length > 0) updateDom();
});

function updateDom() {
    if (!data.items.length) return;
    let replaceCount = 0;
    walk(document.body, (node) => {
        if (typeof node.innerText == 'undefined') return;
        for (const item of data.items) {
            if (node.innerText.indexOf(item) > -1) {
                node.innerText = node.innerText.replace(item, 'REDACTED');
                replaceCount++;
            }
        }
    });
    console.log(
        'Page has been KarenProofed!',
        `${replaceCount} instances of blacklisted words were obfuscated`
    );
}

function walk(node, func) {
    var children = node.childNodes;
    for (
        var i = 0;
        i < children.length;
        i++ // Children are siblings to each other
    )
        walk(children[i], func);
    func(node);
}
