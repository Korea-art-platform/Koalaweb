function handler(event) {
    var request = event.request;
    var headers = request.headers;
    var agent = headers['user-agent'] && headers['user-agent'].value
        ? headers['user-agent'].value.toLowerCase()
        : '';

    var isPreviewBot =
        agent.indexOf('kakaotalk') >= 0 ||
        agent.indexOf('kakaostory') >= 0 ||
        agent.indexOf('facebookexternalhit') >= 0 ||
        agent.indexOf('facebot') >= 0 ||
        agent.indexOf('twitterbot') >= 0 ||
        agent.indexOf('line/') >= 0 ||
        agent.indexOf('slackbot') >= 0 ||
        agent.indexOf('discordbot') >= 0 ||
        agent.indexOf('telegrambot') >= 0 ||
        agent.indexOf('whatsapp') >= 0 ||
        agent.indexOf('skypeuripreview') >= 0 ||
        agent.indexOf('linkedinbot') >= 0 ||
        agent.indexOf('pinterest') >= 0 ||
        agent.indexOf('embedly') >= 0;

    if (!isPreviewBot) {
        return request;
    }

    var product = request.uri.match(/^\/product\/([A-Za-z0-9._-]+)\/?$/);
    if (product) {
        return redirect('/api/v1/share/product/' + product[1]);
    }

    var artist = request.uri.match(/^\/artist\/([A-Za-z0-9._-]+)\/?$/);
    if (artist) {
        return redirect('/api/v1/share/artist/' + artist[1]);
    }

    return request;
}

function redirect(location) {
    return {
        statusCode: 302,
        statusDescription: 'Found',
        headers: {
            'location': { value: location },
            'cache-control': { value: 'public, max-age=600' }
        }
    };
}
