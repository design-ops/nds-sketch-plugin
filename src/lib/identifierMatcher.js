//lhs => specific
//rhs => general
const matchScore = (lhs, rhs) => {
    const [lhsPath, lhsToken] = getPathTokenAndTheme(lhs)
    const [rhsPath, rhsToken, rhsTheme] = getPathTokenAndTheme(rhs)

    if (lhsToken !== rhsToken) {
        return 0;
    }

    let score = 0;
    // Check if rhs.theme != null
    if (rhsTheme != null) {
        score += 1 // << ((lhsPath.length + 1) * 2) // Make @theme-name always win
    }

    if (rhsPath.length === 0) {
        // If the rhs was just a token (and it's matched to get this far) then it's the weakest possible match.
         // So here we return the current score + 1, which will either be 1 or 1 + the maximum possible value if there was a theme.
        return 1 + score;
    }

    if (lhsPath.length === 0) {
        return 0;
    }

    const rhsIterator = rhsPath[Symbol.iterator]();
    let rhsComponent = rhsIterator.next().value

     // The score value of the current component - this goes down each time i.e. starts at the maximum and works its way down
    let nextScore = 1 << (lhsPath.length * 2)

    for (const lhsComponent of lhsPath) {
        // If the lhs doesn't match the rhs component, move on to the next one
        if (getComponentWithoutVariant(lhsComponent) !== getComponentWithoutVariant(rhsComponent)) {
            nextScore /= 4;
            continue;
        }

        score += nextScore/2

        // Check for variants
        const lhsVariant = getVariant(lhsComponent);
        const rhsVariant = getVariant(rhsComponent);

        if (lhsVariant == null && rhsVariant == null) {
            // Do nothing variants not present
        } else if (lhsVariant != null && rhsVariant == null) {
            // To nothing, specific has variant, general doesn't care
        } else if (lhsVariant != null && rhsVariant != null && lhsVariant === rhsVariant) {
            score += nextScore
        } else {
            // If there are variants which don't match, this is a hard fail
            return 0
        }

        // Move on to the next rhs component - and if we are at the end, we have matched and just return the score
        rhsComponent = rhsIterator.next().value
        if (rhsComponent == null) {
            return score
        }

        // Each component in the lhs which matches is more important than the last one.
        // Increase it's score to take that into account
        nextScore /= 4;
    }
    return 0;
}

const getPathTokenAndTheme = (from) => {
    const elements = from.split("/")
    const token = elements.pop()
    let theme = null
      if (elements.length !== 0) {
      theme = elements[0].startsWith("@") ? elements.shift().substring(1) : null
    }
    return [elements.reverse(), token, theme]
}

const getVariant = (component) => {
    const matches = component.match(/\[.+\]/g);
    if (matches && matches.length) {
        return matches[0]
    }
    return null
}

const getComponentWithoutVariant = (component) => {
    if (component.includes("[")) {
        return component.split("[")[0]
    }
    return component
}

module.exports = {matchScore, getPathTokenAndTheme}
