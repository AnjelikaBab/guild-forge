package com.guildforge.dsl;

import java.util.Map;

public class Interpreter {

    public Object evaluate(ASTNode node, Map<String, Number> variables) {
        return switch (node) {
            case ASTNode.Literal(var v) -> v;
            case ASTNode.Variable(String name) -> variables.getOrDefault(name, 0);
            case ASTNode.Unary(Token.TokenType op, ASTNode expr) -> evalUnary(op, evaluate(expr, variables));
            case ASTNode.Binary(ASTNode left, Token.TokenType op, ASTNode right) ->
                    evalBinary(evaluate(left, variables), op, evaluate(right, variables));
        };
    }

    public boolean evaluateBoolean(ASTNode node, Map<String, Number> variables) {
        Object v = evaluate(node, variables);
        return truthy(v);
    }

    private Object evalUnary(Token.TokenType op, Object value) {
        Number n = toNumber(value);
        return switch (op) {
            case NOT -> truthy(value) ? 0L : 1L;
            case MINUS -> negate(n);
            default -> throw new IllegalArgumentException("Unsupported unary: " + op);
        };
    }

    private Object evalBinary(Object left, Token.TokenType op, Object right) {
        if (isComparison(op)) {
            return compare(left, op, right) ? 1L : 0L;
        }
        if (op == Token.TokenType.AND) {
            return truthy(left) && truthy(right) ? 1L : 0L;
        }
        if (op == Token.TokenType.OR) {
            return truthy(left) || truthy(right) ? 1L : 0L;
        }
        Number a = toNumber(left);
        Number b = toNumber(right);
        return switch (op) {
            case PLUS -> add(a, b);
            case MINUS -> subtract(a, b);
            case STAR -> multiply(a, b);
            case SLASH -> divide(a, b);
            default -> throw new IllegalArgumentException("Unsupported binary: " + op);
        };
    }

    private boolean isComparison(Token.TokenType op) {
        return op == Token.TokenType.EQ
                || op == Token.TokenType.NE
                || op == Token.TokenType.LT
                || op == Token.TokenType.LE
                || op == Token.TokenType.GT
                || op == Token.TokenType.GE;
    }

    private boolean compare(Object left, Token.TokenType op, Object right) {
        if (left instanceof Number a && right instanceof Number b) {
            int cmp = Double.compare(a.doubleValue(), b.doubleValue());
            return switch (op) {
                case EQ -> cmp == 0;
                case NE -> cmp != 0;
                case LT -> cmp < 0;
                case LE -> cmp <= 0;
                case GT -> cmp > 0;
                case GE -> cmp >= 0;
                default -> false;
            };
        }
        return switch (op) {
            case EQ -> (left == null && right == null) || (left != null && left.equals(right));
            case NE -> left == null ? right != null : !left.equals(right);
            default -> false;
        };
    }

    private boolean truthy(Object v) {
        if (v == null) {
            return false;
        }
        if (v instanceof Number n) {
            return n.doubleValue() != 0;
        }
        if (v instanceof Boolean b) {
            return b;
        }
        return true;
    }

    private Number toNumber(Object value) {
        if (value instanceof Number n) {
            return n;
        }
        if (value instanceof String s) {
            return Double.valueOf(s);
        }
        throw new IllegalArgumentException("Expected number");
    }

    private Number negate(Number n) {
        if (n instanceof Long l) {
            return -l;
        }
        return -n.doubleValue();
    }

    private Number add(Number a, Number b) {
        return a.doubleValue() + b.doubleValue();
    }

    private Number subtract(Number a, Number b) {
        return a.doubleValue() - b.doubleValue();
    }

    private Number multiply(Number a, Number b) {
        return a.doubleValue() * b.doubleValue();
    }

    private Number divide(Number a, Number b) {
        if (b.doubleValue() == 0) {
            throw new ArithmeticException("Division by zero");
        }
        return a.doubleValue() / b.doubleValue();
    }
}
