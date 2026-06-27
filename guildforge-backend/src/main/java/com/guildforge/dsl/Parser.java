package com.guildforge.dsl;

import java.util.List;

public class Parser {

    private final List<Token> tokens;
    private int pos;

    public Parser(List<Token> tokens) {
        this.tokens = tokens;
        this.pos = 0;
    }

    public ASTNode parseExpression() {
        ASTNode expr = parseOr();
        if (!check(Token.TokenType.EOF)) {
            throw new IllegalArgumentException("Unexpected token after expression: " + peek().type());
        }
        return expr;
    }

    private ASTNode parseOr() {
        ASTNode left = parseAnd();
        while (match(Token.TokenType.OR)) {
            Token op = previous();
            ASTNode right = parseAnd();
            left = new ASTNode.Binary(left, op.type(), right);
        }
        return left;
    }

    private ASTNode parseAnd() {
        ASTNode left = parseEquality();
        while (match(Token.TokenType.AND)) {
            Token op = previous();
            ASTNode right = parseEquality();
            left = new ASTNode.Binary(left, op.type(), right);
        }
        return left;
    }

    private ASTNode parseEquality() {
        ASTNode left = parseComparison();
        while (match(Token.TokenType.EQ, Token.TokenType.NE)) {
            Token op = previous();
            ASTNode right = parseComparison();
            left = new ASTNode.Binary(left, op.type(), right);
        }
        return left;
    }

    private ASTNode parseComparison() {
        ASTNode left = parseAdditive();
        while (match(Token.TokenType.LT, Token.TokenType.LE, Token.TokenType.GT, Token.TokenType.GE)) {
            Token op = previous();
            ASTNode right = parseAdditive();
            left = new ASTNode.Binary(left, op.type(), right);
        }
        return left;
    }

    private ASTNode parseAdditive() {
        ASTNode left = parseMultiplicative();
        while (match(Token.TokenType.PLUS, Token.TokenType.MINUS)) {
            Token op = previous();
            ASTNode right = parseMultiplicative();
            left = new ASTNode.Binary(left, op.type(), right);
        }
        return left;
    }

    private ASTNode parseMultiplicative() {
        ASTNode left = parseUnary();
        while (match(Token.TokenType.STAR, Token.TokenType.SLASH)) {
            Token op = previous();
            ASTNode right = parseUnary();
            left = new ASTNode.Binary(left, op.type(), right);
        }
        return left;
    }

    private ASTNode parseUnary() {
        if (match(Token.TokenType.NOT, Token.TokenType.MINUS)) {
            Token op = previous();
            return new ASTNode.Unary(op.type(), parseUnary());
        }
        return parsePrimary();
    }

    private ASTNode parsePrimary() {
        if (match(Token.TokenType.NUMBER)) {
            return new ASTNode.Literal(previous().literal());
        }
        if (match(Token.TokenType.IDENT)) {
            return new ASTNode.Variable(previous().lexeme());
        }
        if (match(Token.TokenType.LPAREN)) {
            ASTNode inner = parseOr();
            consume(Token.TokenType.RPAREN, "Expect ')'");
            return inner;
        }
        throw new IllegalArgumentException("Unexpected token: " + peek().type());
    }

    private void consume(Token.TokenType type, String message) {
        if (check(type)) {
            advance();
            return;
        }
        throw new IllegalArgumentException(message);
    }

    private boolean match(Token.TokenType... types) {
        for (Token.TokenType t : types) {
            if (check(t)) {
                advance();
                return true;
            }
        }
        return false;
    }

    private boolean check(Token.TokenType type) {
        if (isAtEnd()) {
            return type == Token.TokenType.EOF;
        }
        return peek().type() == type;
    }

    private Token advance() {
        if (!isAtEnd()) {
            pos++;
        }
        return previous();
    }

    private boolean isAtEnd() {
        return peek().type() == Token.TokenType.EOF;
    }

    private Token peek() {
        return tokens.get(pos);
    }

    private Token previous() {
        return tokens.get(pos - 1);
    }
}
