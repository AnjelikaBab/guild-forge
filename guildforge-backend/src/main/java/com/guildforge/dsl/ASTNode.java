package com.guildforge.dsl;

public sealed interface ASTNode permits ASTNode.Literal, ASTNode.Binary, ASTNode.Unary, ASTNode.Variable {

    record Literal(Object value) implements ASTNode {}

    record Variable(String name) implements ASTNode {}

    record Binary(ASTNode left, Token.TokenType op, ASTNode right) implements ASTNode {}

    record Unary(Token.TokenType op, ASTNode expr) implements ASTNode {}
}
