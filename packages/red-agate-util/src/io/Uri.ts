// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



export class Uri {
    public static isAbsolute(uri: string) {
        const x = uri.toLowerCase();
        if (x.startsWith('/') || x.startsWith('\\') ) {
            // absolute local directory
            // or UNC paths (e.g. \\\\server\\path, \\\\?\\long\\path)
            return true;
        }
        if (x === '.' || x.startsWith('./') || x.startsWith('.\\')) {
            return false;
        }
        if (x === '..' || x.startsWith('../') || x.startsWith('..\\')) {
            return false;
        }
        if (x.match(/^([a-z][a-z0-9+\-.]*):/)) {
            // url scheme
            return true;
        }
        if (x.match(/^[a-z]:[/\/]/)) {
            // windows drive letter + root
            return true;
        }
        return false;
    }

    public static getDirectory(uri: string) {
        let p = '';
        let x = uri;
        if (x.startsWith('\\\\?\\')) {
            p += '\\\\?\\';
            x = x.substring(3);
        }

        let query = x.indexOf('?');
        if (query < 0) query = x.length;
        let hash = x.indexOf('#');
        if (hash < 0) hash = x.length;
        x = x.substring(0, Math.min(query, hash));

        if (x.endsWith('/') || x.endsWith('\\')) {
            return p + x;
        }

        while (x.length > 0) {
            x = x.substring(0, x.length - 1);
            if (x.endsWith('/') || x.endsWith('\\')) {
                return p + x;
            }
        }
        return (p + x) || '/';
    }

    public static join(base: string, needle: string) {
        if (Uri.isAbsolute(needle)) {
            return needle;
        }
        return Uri.getDirectory(base) + needle;
    }

    public static getPathExt(path: string): string {
        return (path.slice((path.lastIndexOf(".") - 1 >>> 0) + 2)).toLowerCase();
    }

    public static pathExtToContentType(pathExt: string): string | null {
        let contentType: string | null = null;

        switch (pathExt) {
            case "jpeg":
            case "jpg":
                contentType = "image/jpeg";
                break;
            case "png":
                contentType = "image/png";
                break;
            case "gif":
                contentType = "image/gif";
                break;
            case "svg":
            case "svgz":
                contentType = "image/svg+xml";
                break;
            case "tiff":
            case "tif":
                contentType = "image/tiff";
                break;
            case "jp2":
            case "j2c":
                contentType = "image/jp2";
                break;

            case "css":
                contentType = "text/css";
                break;
            case "js":
                contentType = "text/javascript";
                break;
            case "csv":
                contentType = "text/csv";
                break;
            case "txt":
                contentType = "text/plain";
                break;
            case "html":
            case "htm":
                contentType = "text/plain";
                break;
        }
        return contentType;
    }
}


