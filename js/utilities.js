module.exports = {

    /**
     * Parse a slug string.
     * Examples:
     *     "t_items/23"
     *         table: "t_items"
     *         id: "23"
     *
     *     "t_items/:name/toby"
     *         table: "t_items"
     *         originField: "name"
     *         id: "toby"
     *
     *      "t_items"
     *          table: "t_items"
     * @TODO rename "table, field, value"
     * @param  {string} slug
     * @return {object}
     */
    parseSlug: function parseSlug(slug){
        var parsed = {};
        var slugParts = slug.split('/');
        parsed.table = slugParts[0];
        var id = slugParts[1];
        if(id && id[0]===':'){
            parsed.originField = id.substr(1);
            parsed.id = slugParts[2];
            parsed._singleId = false;
        }else{
            parsed.id = id;
            parsed._singleId = true;
        }
        return parsed;
    }
};
