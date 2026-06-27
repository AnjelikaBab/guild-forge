package com.guildforge.dsl;

import java.util.ArrayList;
import java.util.List;

public class Lexer {

    private final String source;
    private int start;
    private int current;
    private final List<Token> tokens = new ArrayList<>();

    public Lexer(String source) {
        this.source = source != null ? source : "";
    }

    public List<Token> tokenize() {
        tokens.clear();
        start = 0;
        current = 0;
        while (!isAtEnd()) {
            start = current;
            char c = advance();
            if (Character.isWhitespace(c)) {
                continue;
            }
            if (Character.isDigit(c)) {
                number();
                continue;
            }
            if (Character.isLetter(c) || c == '_') {
                identifierOrKeyword();
                continue;
            }
            switch (c) {
                case '(' -> addToken(Token.TokenType.LPAREN, "(");
                case ')' -> addToken(Token.TokenType.RPAREN, ")");
                case '+' -> addToken(Token.TokenType.PLUS, "+");
                case '-' -> addToken(Token.TokenType.MINUS, "-");
                case '*' -> addToken(Token.TokenType.STAR, "*");
                case '/' -> addToken(Token.TokenType.SLASH, "/");
                case ',' -> addToken(Token.TokenType.COMMA, ",");
                case '!' -> {
                    if (match('=')) {
                        addToken(Token.TokenType.NE, "!=");
                    } else {
                        addToken(Token.TokenType.NOT, "!");
                    }
                }
                case '=' -> {
                    if (match('=')) {
                        addToken(Token.TokenType.EQ, "==");
                    } else {
                        throw new IllegalArgumentException("Unexpected '='");
                    }
                }
                case '<' -> addToken(match('=') ? Token.TokenType.LE : Token.TokenType.LT, lexemeFromStart());
                case '>' -> addToken(match('=') ? Token.TokenType.GE : Token.TokenType.GT, lexemeFromStart());
                default -> throw new IllegalArgumentException("Unexpected character: " + c);
            }
        }
        tokens.add(new Token(Token.TokenType.EOF, "", null));
        return List.copyOf(tokens);
    }

    private void identifierOrKeyword() {
        while (isAlphaNumeric(peek())) {
            advance();
        }
        String text = source.substring(start, current);
        Token.TokenType type =
                switch (text) {
                    case "AND" -> Token.TokenType.AND;
                    case "OR" -> Token.TokenType.OR;
                    case "NOT" -> Token.TokenType.NOT;
                    default -> Token.TokenType.IDENT;
                };
        tokens.add(new Token(type, text, type == Token.TokenType.IDENT ? text : null));
    }

    private void number() {
        while (Character.isDigit(peek())) {
            advance();
        }
        if (peek() == '.' && Character.isDigit(peekNext())) {
            advance();
            while (Character.isDigit(peek())) {
                advance();
            }
        }
        String text = source.substring(start, current);
        Number value;
        if (text.contains(".")) {
            value = Double.parseDouble(text);
        } else {
            value = Long.parseLong(text);
        }
        tokens.add(new Token(Token.TokenType.NUMBER, text, value));
    }

    private String lexemeFromStart() {
        return source.substring(start, current);
    }

    private boolean match(char expected) {
        if (isAtEnd()) {
            return false;
        }
        if (source.charAt(current) != expected) {
            return false;
        }
        current++;
        return true;
    }

    private char peek() {
        if (isAtEnd()) {
            return '\0';
        }
        return source.charAt(current);
    }

    private char peekNext() {
        if (current + 1 >= source.length()) {
            return '\0';
        }
        return source.charAt(current + 1);
    }

    private boolean isAlphaNumeric(char c) {
        return Character.isLetterOrDigit(c) || c == '_';
    }

    private char advance() {
        return source.charAt(current++);
    }

    private boolean isAtEnd() {
        return current >= source.length();
    }

    private void addToken(Token.TokenType type, String lexeme) {
        tokens.add(new Token(type, lexeme != null ? lexeme : lexemeFromStart(), null));
    }
}
